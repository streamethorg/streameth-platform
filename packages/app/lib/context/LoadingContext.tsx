"use client";
import { useState, createContext } from "react";
import Image from "next/image";
export const LoadingContext = createContext<{
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({
	isLoading: true,
	setIsLoading: () => {},
});

export const LoadingContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<LoadingContext.Provider value={{ isLoading, setIsLoading }}>
			<LoadingModal isLoading={false} />
			{children}
		</LoadingContext.Provider>
	);
};

const LoadingModal = ({
	isLoading,
	text = "Loading...",
	textColor = "text-gray-700",
	spinnerColor = "text-blue-500",
}: {
	isLoading: boolean;
	text?: string;
	textColor?: string;
	spinnerColor?: string;
}) => {
	if (!isLoading) {
		return null;
	}

	return (
		<div className="flex fixed inset-0 flex-col justify-center items-center z-[99999] bg-white/80 backdrop-blur-sm">
			<div className="w-16 h-16">
				<svg
					className={`animate-spin w-full h-full ${spinnerColor}`}
					fill="none"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						fill="currentColor"
					></path>
				</svg>
			</div>
			{text && (
				<p className={`mt-4 text-xl font-semibold animate-pulse ${textColor}`}>
					{text}
				</p>
			)}
		</div>
	);
};
