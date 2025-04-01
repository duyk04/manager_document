
import Link from "next/link";
import { Button } from "../ui/button";

export const NoAccess = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-2xl font-bold text-rose-500">No Access</h1>
            <p className="mt-2 text-xl text-gray-600">Vui lòng liên hệ quản trị viên để kích hoạt tài khoản!</p>
            <Link href="/home">
                <Button className="mt-4" variant="outline">
                    Quay về trang chủ
                </Button>
            </Link>
        </div>
    );
}

export const NoPermission = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-2xl font-bold text-rose-500">No Permission</h1>
            <p className="mt-2 text-xl text-gray-600">Bạn không có quyền truy cập vào trang này!</p>
            <Link href="/home">
                <Button className="mt-4" variant="outline">
                    Quay về trang chủ
                </Button>
            </Link>
        </div>
    );
}

export const NoPermissionEdit = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-2xl font-bold text-rose-500">No Permission</h1>
            <p className="mt-2 text-xl text-gray-600">Bạn không có quyền chỉnh sửa văn bản này!</p>
            <Link href="/home">
                <Button className="mt-4" variant="outline">
                    Quay về trang chủ
                </Button>
            </Link>
        </div>
    );
}

export const NoData = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-2xl font-bold text-gray-500">No Data</h1>
            <p className="mt-2 text-xl text-gray-600">Không có dữ liệu để hiển thị!</p>
        </div>
    );
}
