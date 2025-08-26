"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { IExtendedStage } from "@/lib/types";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import useSearchParams from "@/lib/hooks/useSearchParams";
import { SessionType } from "streameth-new-server/src/interfaces/session.interface";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import DatePicker from "@/components/misc/form/datePicker";
  import { Filter } from "lucide-react";

const LibraryFilter = ({ stages }: { stages: IExtendedStage[] }) => {
	const { searchParams, handleTermChange } = useSearchParams();
	const [selectedStage, setSelectedStage] = useState(
		searchParams?.get("stage") || "",
	);
	const [selectedType, setSelectedType] = useState(
		searchParams?.get("type") || "",
	);
	const [selectedVisibility, setSelectedVisibility] = useState(
		searchParams?.get("published") || "",
	);
	const [selectedDate, setSelectedDate] = useState(
		searchParams?.get("date") || "",
	);
	const [selectedItemStatus, setSelectedItemStatus] = useState(
		searchParams?.get("itemStatus") || "",
	);
	const [selectedClipable, setSelectedClipable] = useState(
		searchParams?.get("clipable") || "",
	);
	const [activeFilterCount, setActiveFilterCount] = useState(0);

	const updateFilter = (key: string, value: string) => {
		handleTermChange([
			{ key, value },
			{ key: "page", value: "1" },
		]);
	};

	const handleClearFilter = () => {
		setSelectedStage("");
		setSelectedType("");
		setSelectedVisibility("");
		setSelectedDate("");
		setSelectedItemStatus("");
		setSelectedClipable("");
		handleTermChange([
			{ key: "stage", value: "" },
			{ key: "type", value: "" },
			{ key: "published", value: "" },
			{ key: "itemDate", value: "" },
			{ key: "itemStatus", value: "" },
			{ key: "clipable", value: "" },
			{ key: "page", value: "1" },
		]);
	};

	useEffect(() => {
		const count = [
			selectedStage,
			selectedType,
			selectedVisibility,
			selectedDate,
			selectedItemStatus,
			selectedClipable,
		].filter(Boolean).length;
		setActiveFilterCount(count);
	}, [
		selectedStage,
		selectedType,
		selectedVisibility,
		selectedDate,
		selectedItemStatus,
		selectedClipable,
	]);

	const sessionTypes = Object.keys(SessionType).map((key) => ({
		label:
			key === "editorClip"
				? "Edited clip"
				: key.charAt(0).toUpperCase() + key.slice(1),
		value: (SessionType as any)[key],
	}));

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm">
					<Filter size={18} />
					{activeFilterCount > 0 && `( ${activeFilterCount} )`}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-4">
				<div className="flex flex-col gap-4">
					<Button onClick={handleClearFilter} size="sm" variant="outline">
						Clear Filters
					</Button>

					<div className="flex flex-col gap-1 items-start">
						<label htmlFor="stage" className="text-sm font-medium">
							Stage
						</label>
						<Select
							value={selectedStage}
							onValueChange={(value) => {
								setSelectedStage(value);
								updateFilter("stage", value);
							}}
						>
							<SelectTrigger id="stage">
								<SelectValue placeholder="Select a stage" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{stages.map((stage) => (
										<SelectItem key={stage._id} value={stage._id!}>
											{stage.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1 items-start">
						<label htmlFor="type" className="text-sm font-medium">
							Type
						</label>
						<Select
							value={selectedType}
							onValueChange={(value) => {
								setSelectedType(value);
								updateFilter("type", value);
							}}
						>
							<SelectTrigger id="type">
								<SelectValue placeholder="Select video type" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{sessionTypes.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											{type.label.charAt(0).toUpperCase() + type.label.slice(1)}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1 items-start">
						<label htmlFor="visibility" className="text-sm font-medium">
							Visibility
						</label>
						<Select
							value={selectedVisibility}
							onValueChange={(value) => {
								setSelectedVisibility(value);
								updateFilter("published", value);
							}}
						>
							<SelectTrigger id="visibility">
								<SelectValue placeholder="Select visibility" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="false">Private</SelectItem>
									<SelectItem value="true">Public</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1 items-start">
						<label htmlFor="itemDate" className="text-sm font-medium">
							Date
						</label>
						<DatePicker
							allowPast
							value={new Date(Number(selectedDate))}
							onChange={(value) => {
								const unixTimestamp = Math.floor(value.getTime());
								setSelectedDate(unixTimestamp.toString());
								updateFilter("itemDate", unixTimestamp.toString());
							}}
						/>
					</div>

					<div className="flex flex-col gap-1 items-start">
						<label htmlFor="itemStatus" className="text-sm font-medium">
							Status
						</label>
						<Select
							value={selectedItemStatus}
							onValueChange={(value) => {
								setSelectedItemStatus(value);
								updateFilter("itemStatus", value);
							}}
						>
							<SelectTrigger id="itemStatus">
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="completed">Completed</SelectItem>
									<SelectItem value="pending">Pending</SelectItem>
									<SelectItem value="failed">Failed</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="flex flex-col gap-1 items-start">
						<label htmlFor="clipable" className="text-sm font-medium">
							Clipable
						</label>
						<Select
							value={selectedClipable}
							onValueChange={(value) => {
								setSelectedClipable(value);
								updateFilter("clipable", value);
							}}
						>
							<SelectTrigger id="clipable">
								<SelectValue placeholder="Select clipable status" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="true">Yes</SelectItem>
									<SelectItem value="false">No</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default LibraryFilter;
