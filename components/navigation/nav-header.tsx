"use client"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

// Danh sách route với title
const hrefs = [
    { title: "Trang chủ", url: "/home" },
    { title: "Admin", url: "/admin/dashboard" },
    { title: "Tài khoản", url: "/admin/account" },
    { title: "Danh sách tài khoản", url: "/admin/account/list" },
    { title: "Thêm tài khoản", url: "/admin/account/create-account" },
    { title: "Chỉnh sửa tài khoản", url: "/admin/account/edit" },
    { title: "Quản lí đơn vị, khoa", url: "/admin/department" },
    { title: "Quản lí lĩnh vực văn bản", url: "/admin/field" },
    { title: "Quản lí loại văn bản", url: "/admin/type" },
    { title: "Quản lí cấp ban hành", url: "/admin/release-level" },
    { title: "Danh sách chương trình đào tạo", url: "/CTDT" },
    { title: "Tạo mới", url: "/CTDT/create" },
    { title: "Danh sách tiêu chuẩn", url: "/tieuchuan/view" },
    { title: "Tạo mới tiêu chuẩn", url: "/tieuchuan/create" },
    { title: "Danh sách tiêu chí", url: "/tieuchi/view" },
    { title: "Thêm mới tiêu chí", url: "/tieuchi/create" },
    { title: "Danh sách minh chứng", url: "/proofDocuments" },
    { title: "Thêm mới minh chứng", url: "/proofDocuments/create" },
    { title: "Chỉnh sửa minh chứng", url: "/proofDocuments/edit" },
    { title: "Danh sách văn bản", url: "/document/view" },
    { title: "Chỉnh sửa văn bản", url: "/document/edit" },
    { title: "Xem chi tiết văn bản", url: "/document/view/" },
    { title: "Thông tin tài khoản", url: "/profile/information" },
    { title: "Thêm mới tài liệu, văn bản", url: "/document/create" },
];

export const NavHeader = () => {
    const locationPath = usePathname();
    
    // Lọc ra các breadcrumb từ danh sách href
    const breadcrumbItems = hrefs.filter(item => locationPath.startsWith(item.url));

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
                            fixed top-0 bg-white shadow-sm border-b border-gray-200 w-full z-10">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {/* <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem> */}

                        {breadcrumbItems.map((item, index) => (
                            <BreadcrumbItem key={index}>
                                <ChevronRight className="h-4 w-4" />
                                <BreadcrumbLink href={item.url}>
                                    {item.title}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
};
