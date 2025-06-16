import { fetchNFTCollection } from "@/lib/services/nftCollectionService";
import { nftPageParams } from "@/lib/types";
import { LuArrowLeft } from "react-icons/lu";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import ContractDetails from "./components/ContractDetails";
import CopyText from "@/components/misc/CopyText";
import TitleTextItem from "@/components/ui/TitleTextItem";

const page = async ({ params: paramsPromise }: nftPageParams) => {
	const params = await paramsPromise;

	if (!params.nftId) return notFound();

	const collection = await fetchNFTCollection({
		collectionId: params.nftId,
	});
	if (!collection) return notFound();

	return (
		<div className="p-2 mx-6 h-full">
			<Link href={`/studio/${params.organization}/library`}>
				<div className="flex justify-start items-center my-4 space-x-4">
					<LuArrowLeft />
					<p>Back to collections</p>
				</div>
			</Link>

			<div className="flex overflow-auto flex-col p-4 bg-white rounded-xl border">
				<h3 className="mb-3 text-lg font-bold">Collection Details</h3>

				<CopyText
					width="600px"
					label="Contract Address:"
					text={collection.contractAddress}
				/>

				<TitleTextItem title="Type:" text={collection.type} />
				<TitleTextItem title="Total Items:" text={collection.videos?.length} />

				<ContractDetails contractAddress={collection.contractAddress} />
			</div>
		</div>
	);
};

export default page;
