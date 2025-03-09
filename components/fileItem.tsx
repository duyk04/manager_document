
import useFetchFileName from "../hooks/useFetchFileName";
import { IconPdf, IconWord, IconExcel } from "./ui/file-icon";

interface FileItemProps {
    filePDF: string;
    fileGoc: string;
    index: number;
}

const FileItem: React.FC<FileItemProps> = ({ filePDF, fileGoc, index }) => {
    const { fileName: pdfFileName } = useFetchFileName(filePDF);
    const { fileName: originalFileName, typeFile } = useFetchFileName(fileGoc);

    return (
        <li className="mt-2 flex items-center space-x-2 border border-gray-200 p-2 rounded-md w-full">
            <p className="text-gray-600 w-[60px]">Tệp {index + 1}:</p>

            {/* File PDF */}
            <div className="w-1/2">
                <a
                    href={filePDF}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline w-1/2"
                >
                    <div className="flex items-center text-start space-x-2">
                        <span><IconPdf /></span>
                        <p className="truncate w-1/2">{pdfFileName || "No PDF file"}</p>
                    </div>
                </a>
            </div>
            {/* File Gốc */}
            <div className="w-1/2">
                <a
                    href={fileGoc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline w-1/2"
                >
                    <div className="flex items-center text-start space-x-2">
                        {(() => {
                            if (typeFile === "docx" || typeFile === "doc") {
                                return <span className="text-green-500"><IconWord /></span>;
                            }
                            if (typeFile === "xls" || typeFile === "xlsx") {
                                return <span className="text-green-500"><IconExcel /></span>;
                            }
                        })()}
                        <p className="truncate w-4/5">{originalFileName || "File gốc trống"}</p>
                    </div>
                </a>
            </div>

        </li>
    );
};

export default FileItem;
