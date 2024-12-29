import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileIcon } from "lucide-react";

interface FileUploadProps {
	value?: string;
	onChange?: (filePath: string) => void;
}

export const FileUpload = ({
	value,
	onChange
}: FileUploadProps) => {
	const [file, setFile] = useState<File | null>(null);
	const [uploadStatus, setUploadStatus] = useState<string>("");
	const [response, setResponse] = useState<{ status: string; filePath: string } | null>(null);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			setFile(event.target.files[0]);
		}
	};

	const handleUpload = async () => {
		if (!file) {
			setUploadStatus("Please select a file first.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await axios.post("/api/upload", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			setUploadStatus("Upload successful");
			setResponse(response.data);

			// Gọi hàm onChange để truyền giá trị filePath về cha
			if (response.data.status === "success" && onChange) {
				onChange(response.data.filePath);
			}
		} catch (error) {
			setUploadStatus("Failed to upload file.");
		}
	};

	if (response?.status === "success") {
		return (
			<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
				<FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
				<a
					href={response.filePath}
					target="_blank"
					rel="noreferrer noopener"
					className="ml-2 w-[380px] text-indigo-500 text-sm dark:text-indigo-400 hover:underline overflow-hidden whitespace-nowrap"
				>
					{response.filePath}
				</a>
			</div>
		);
	}

	return (
		<div className="px-6 grid grid-cols-6 gap-4">
			<Input
				type="file"
				onChange={handleFileChange}
				className="col-span-4 bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
			/>
			<Button className="col-span-1" variant="primary" onClick={handleUpload}>
				Up file
			</Button>
		</div>
	);
};

