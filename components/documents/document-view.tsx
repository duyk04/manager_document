"use client"

import { IconExcel, IconPdf, IconWord } from "../ui/file-icon";
import useFetchFileName from "@/hooks/useFetchFileName";

interface DocumentViewProps {
    document: any;
}
export const ViewDocument = ({
    document
}: DocumentViewProps) => {

    return (
        <div className="flex flex-col items-center">
            <div className="w-1/2  mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-800">Thông Tin Văn Bản</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Mã:</p>
                        <p className="font-semibold">{document.ma}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Tên văn bản</p>
                        <p className="font-semibold">{document.tenTaiLieu}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Khoa:</p>
                        <p className="font-semibold">{document.donVi.tenDonVi}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Lĩnh vực:</p>
                        <p className="font-semibold">{document.linhVuc.tenLinhVuc}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Loại văn bản</p>
                        <p className="font-semibold">{document.capBanHanh.tenCap}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Cấp ban hành</p>
                        <p className="font-semibold">{document.capBanHanh.tenCap}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Số Văn Bản:</p>
                        <p className="font-semibold">{document.soVanBan}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Tên Tài Liệu:</p>
                        <p className="font-semibold">{document.tenTaiLieu}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Mô Tả:</p>
                        <p className="font-semibold">{document.trichYeu}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Đơn vị:</p>
                        <p className="font-semibold">{document.donVi.tenDonVi}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Phạm Vi:</p>
                        <p className="font-semibold">{
                            document.phamVi === 'NOIBO' ? 'Nội Bộ' : 'Công Khai'
                        }</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Ngày Ban Hành:</p>
                        <p className="font-semibold">{new Date(document.ngayBanHanh).toLocaleDateString()}</p>
                    </div>
                </div>
                {document.file && document.file.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Tệp Đính Kèm</h3>
                        {document.file.map((file: { filePDF: string; fileGoc: string }, index: number) => {
                            const { fileName: pdfFileName } = useFetchFileName(file.filePDF);
                            const { fileName: originalFileName, typeFile } = useFetchFileName(file.fileGoc);

                            return (
                                <div key={index} className="mt-2 flex items-center space-x-2 border border-gray-200 p-2 rounded-md">
                                    <p className="text-gray-600 w-[50px]">Tệp {index + 1}:</p>

                                    {/* Link file PDF */}
                                    <a
                                        href={file.filePDF ?? undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline w-1/2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <span><IconPdf /></span>
                                            <p className="truncate w-1/2">{pdfFileName || "No PDF file"}</p>
                                        </div>
                                    </a>

                                    {/* Link file gốc */}
                                    <a
                                        href={file.fileGoc ?? undefined}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline w-1/2"
                                    >
                                        <div className="flex items-center space-x-2">
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
                            );
                        })}
                    </div>
                )}
            </div>
        </div>

    );
}