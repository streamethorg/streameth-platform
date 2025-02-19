import { createReadStream, createWriteStream, unlinkSync } from "fs";
import { google, youtube_v3 } from "googleapis";
import https from "https";
import { logger } from "./logger";

function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function getYoutubeClient(accessToken: string) {
	const oauth2Client = new google.auth.OAuth2();
	oauth2Client.setCredentials({
		access_token: accessToken,
	});
	return google.youtube({
		version: "v3",
		auth: oauth2Client,
	});
}

async function checkVideoProcessingStatus(
	videoId: string,
	youtube: youtube_v3.Youtube,
): Promise<string> {
	const response = await youtube.videos.list({
		id: [videoId],
		part: ["processingDetails"],
	});
	return response.data.items[0].processingDetails.processingStatus ?? "";
}

async function downloadImage(
	url: string,
	filePath: string,
): Promise<{ success: boolean; message?: string }> {
	return new Promise((resolve) => {
		https
			.get(url, (response) => {
				if (response.statusCode === 200) {
					const fileStream = createWriteStream(filePath);
					response.pipe(fileStream);

					fileStream.on("finish", () => {
						fileStream.close();
						console.log("Image download completed:", filePath);
						resolve({ success: true });
					});
				} else {
					console.error("Image download failed:", response.statusCode);
					resolve({
						success: false,
						message: `Failed with status code: ${response.statusCode}`,
					});
				}
			})
			.on("error", (error) => {
				console.error("Error downloading image:", error.message);
				resolve({ success: false, message: error.message });
			});
	});
}

async function setThumbnail(
	youtube: youtube_v3.Youtube,
	videoId: string,
	filePath: string,
): Promise<void> {
	try {
		const response = await youtube.thumbnails.set({
			videoId: videoId,
			media: {
				body: createReadStream(filePath),
			},
		});
		console.log("Thumbnail set successfully:", response.data);
	} catch (error) {
		console.error("Error setting thumbnail:", error);
	}
}

enum ePublished {
	public = "public",
	unlisted = "unlisted",
	private = "private",
}

export async function uploadToYouTube(
	session: {
		name: string;
		description: string;
		slug: string;
		published: ePublished;
		coverImage: string;
	},
	videoFilePath: string,
	token: { key?: string; secret: string },
): Promise<void> {
	try {
		const youtube = await getYoutubeClient(token.secret);
		const insertResponse = await youtube.videos.insert({
			part: ["status", "snippet"],
			requestBody: {
				snippet: {
					title: session.name,
					description: session.description,
					defaultLanguage: "en",
					defaultAudioLanguage: "en",
				},
				status: {
					privacyStatus: session.published,
					selfDeclaredMadeForKids: false,
					madeForKids: false,
				},
			},
			media: {
				body: createReadStream(videoFilePath),
			},
		});

		let processingStatus = "processing";
		while (processingStatus === "processing") {
			logger.info("Video is still processing");
			processingStatus = await checkVideoProcessingStatus(
				insertResponse.data.id,
				youtube,
			);
			if (processingStatus === "processing") {
				await delay(180000); // Delay for 3 minutes
			} else if (processingStatus === "error") {
				return;
			}
		}
		if (session.coverImage) {
			logger.info("Downloading image:", session.coverImage);
			const filePath = `./tmp/${session.slug}.jpg`;
			const imageResponse = await downloadImage(session.coverImage, filePath);
			if (imageResponse.success) {
				await setThumbnail(youtube, insertResponse.data.id, filePath);
				unlinkSync(filePath);
				return;
			}
		}
		logger.info("Video uploaded successfully");
		return;
	} catch (error) {
		logger.error("An error occurred:", error);
		if (error.message == "Invalid Credentials") {
			throw new Error("Unauthorized");
		}
		return;
	}
}
