import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET(req: Request) {
    try {
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const listMa_MinhChung = ["MC-001"];

        const listMC = await db.minhChung.findMany({
            where: {
                maMinhChung: {
                    in: listMa_MinhChung,
                },
            },
        });

        // Chuyển đổi dữ liệu từ database thành định dạng cần xuất
        const data = listMC.map((item) => {
            return {
                'Mã minh chứng': item.maMinhChung,
                'Tên minh chứng': item.tenMinhChung,
                'Năm đánh giá': item.namDanhGia,
                'Mô tả': item.moTa,
            };
        });

        // Tạo worksheet từ dữ liệu
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Tùy chỉnh định dạng bảng
        const range = worksheet['!ref'] ? XLSX.utils.decode_range(worksheet['!ref']) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }; // Lấy phạm vi bảng
        const headerStyle = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4F81BD" } },
            alignment: { horizontal: "center", vertical: "center" },
        };

        // Áp dụng định dạng cho các ô header
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: range.s.r, c: col })];
            if (cell) {
                cell.s = headerStyle;
            }
        }

        // Định dạng các ô trong bảng (căn giữa và thay đổi màu chữ)
        const cellStyle = {
            alignment: { horizontal: "center", vertical: "center" },
            font: { color: { rgb: "000000" } },
        };

        // Áp dụng định dạng cho các ô trong bảng (trừ header)
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
                if (cell) {
                    cell.s = cellStyle;
                }
            }
        }

        // Tạo workbook và thêm worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Minh Chung");

        // Tạo buffer Excel
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

        // Trả về file Excel dưới dạng buffer
        return new NextResponse(excelBuffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": 'attachment; filename="minhChung.xlsx"',
            },
        });

    } catch (error) {
        console.error("Export Excel", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
