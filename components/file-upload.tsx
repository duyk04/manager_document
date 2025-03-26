import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { IconExcel, IconPdf, IconWord } from "./ui/file-icon";

interface FileUploadProps {
	value?: string;
	onChange?: (filePath: string) => void;
	typeFile?: '.pdf' | '.doc' | '.docx' | '.xls' | '.xlsx' | '.doc, .docx, .xls, .xlsx';
	required?: boolean;
}

export const FileUpload = ({
	value,
	typeFile,
	required,
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

	const handleUpload = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault(); // Ngăn hành động mặc định
		if (!file) {
			setUploadStatus("Please select a file first.");
			return;
		}

		const formData = new FormData();
		formData.append("file", file);

		try {
			const response = await axios.post("/api/upload",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },
				}
			);

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
		const typeFile = response.filePath.split(".").pop();
		return (
			<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 border border-indigo-200 dark:border-indigo-400">

				{(typeFile === "pdf") && (
					<IconPdf />
				)}

				{(typeFile === "doc" || typeFile === "docx") && (
					<IconWord />
				)}

				{(typeFile === "xls" || typeFile === "xlsx") && (
					<IconExcel />
				)}

				<a
					href={response.filePath}
					target="_blank"
					rel="noreferrer noopener"
					className="ml-2 w-[380px] text-indigo-500 text-sm dark:text-indigo-400 hover:underline overflow-hidden whitespace-nowrap"
				>
					{response.filePath.split("/").pop()}
				</a>
				<button
					onClick={() => { setResponse(null); onChange && onChange("") }}
					className="bg-rose-500 text-white p-1
                    rounded-full absolute top-[-10px] right-[-10px] shadow-sm"
					type="button"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		);
	}

	if (value) {
		const typeFile = value.split(".").pop();
		return (
			<div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 border border-indigo-200 dark:border-indigo-400">
				{(typeFile === "pdf") && (
					<IconPdf />
				)}

				{(typeFile === "doc" || typeFile === "docx") && (
					<IconWord />
				)}

				{(typeFile === "xls" || typeFile === "xlsx") && (
					<IconExcel />
				)}
				<a
					href={value}
					target="_blank"
					rel="noreferrer noopener"
					className="ml-2 w-[380px] text-indigo-500 text-sm dark:text-indigo-400 hover:underline overflow-hidden whitespace-nowrap"
				>
					{value.split("/").pop()}
				</a>
				<button
					onClick={() => onChange && onChange("")}
					className="bg-rose-500 text-white p-1
                    rounded-full absolute top-[-10px] right-[-10px] shadow-sm"
					type="button"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		);
	}

	return (
		<div className="px-6 grid grid-cols-6 gap-4">
			<Input
				type="file"
				onChange={handleFileChange}
				className="col-span-4 bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
				accept={typeFile}
				required={required}
			/>
			<Button className="col-span-1" variant="primary" onClick={handleUpload}>
				Tải lên
			</Button>
		</div>
	);
};

