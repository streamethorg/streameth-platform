import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import React from "react";
import CreateNFTCollectionModal from "./components/CreateNFTCollectionModal";
import { fetchOrganizationNFTCollections } from "@/lib/services/nftCollectionService";
import { fetchOrganization } from "@/lib/services/organizationService";
import NFTCollectionCard from "./components/NFTCollectionCard";
import MintNftSort from "./components/MintNftSort";
import { sortArray } from "@/lib/utils/utils";
import { IExtendedNftCollections } from "@/lib/types";

const NFT = async ({
	params,
	searchParams,
}: {
	params: Promise<{ organization: string }>;
	searchParams: Promise<{ type: string; sort: string }>;
}) => {
	const { type, sort } = await searchParams;
	const { organization } = await params;

	const organizationId = (
		await fetchOrganization({ organizationId: organization })
	)?._id;
	if (!organizationId) return null;
	const nftCollections = sortArray(
		await fetchOrganizationNFTCollections({
			organizationId,
		}),
		sort || "desc_alpha",
	);

	return (
		<div className="flex flex-col h-full bg-white">
			<Card
				style={{
					backgroundImage: `url(/backgrounds/nftBg.svg)`,
					backgroundPositionX: "center",
				}}
				className="p-4 text-white bg-black bg-no-repeat bg-cover rounded-none border-none shadow-none"
			>
				<CardHeader>
					<CardTitle>Create Epic NFT Collection</CardTitle>
					<CardDescription className="text-white max-w-[400px]">
						Create NFT collection from your livestream on Base Chain.
					</CardDescription>
				</CardHeader>

				<CardFooter>
					<CreateNFTCollectionModal type={type} />
				</CardFooter>
			</Card>

			<div className="flex flex-col p-4 h-full">
				<div className="flex justify-between items-center mb-4">
					<p className="text-lg font-semibold">Your Collections</p>
					<MintNftSort />
				</div>

				{nftCollections.length > 0 ? (
					<div className="grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
						{nftCollections.map((nft) => (
							<NFTCollectionCard
								organization={organization}
								key={nft._id}
								nft={nft as IExtendedNftCollections}
							/>
						))}
					</div>
				) : (
					<div className="flex flex-col justify-center items-center m-auto h-96 bg-white">
						<Image
							src="/images/empty-box.png"
							width={150}
							height={150}
							alt="empty nft"
						/>
						<CardTitle className="mt-4 text-2xl font-semibold">
							No NFT Collection
						</CardTitle>
						<CardDescription>
							Create your an NFT collection to get started!
						</CardDescription>
						<div className="mt-6 w-fit">
							<CreateNFTCollectionModal type={type} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default NFT;
