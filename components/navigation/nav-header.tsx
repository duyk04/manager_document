"use client"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ChevronRight } from "lucide-react"
import { usePathname } from "next/navigation"

// const href = [
//     {
//         title: "Trang chủ",
//         url: "/home",
//     },
//     {
//         title: "Admin",
//         url: "/admin",
//     },
//     {
//         title: "Tài khoản",
//         url: "/admin/account",
//     }
// ]

export const NavHeader = () => {
    const locationPath = usePathname();
    // console.log(locationPath);
    // vi du http://localhost:3000/admin/account
    // ? sử dụng redux để lưu lại đường dẫn hiện tại 
    const pathParts = locationPath.split("/").filter((part) => part !== "");
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12
                            fixed top-0 bg-white shadow-sm border-b border-gray-200 w-full z-10">
            <div className="flex items-center gap-2 px-4 ">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                        <BreadcrumbList>
                            {/* <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">
                                Building Your Application
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                        </BreadcrumbItem> */}
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            {/* <BreadcrumbSeparator /> */}
                            

                            {pathParts.map((part, index) => {

                                // Tạo liên kết cho mỗi phần trong đường dẫn
                                const href = `/${pathParts.slice(0, index + 1).join("/")}`;
                                // console.log(part[0]);

                                if (index === 0 && part === "home") {
                                    return null;
                                }

                                return (
                                    <BreadcrumbItem key={index}>
                                        <ChevronRight className="h-4 w-4" />
                                        <BreadcrumbLink href={href}>
                                            {part.charAt(0).toUpperCase() + part.slice(1)} {/* Viết hoa chữ cái đầu tiên */}
                                        </BreadcrumbLink>
                                        {/* {index < pathParts.length - 1 && <BreadcrumbSeparator />} */}
                                    </BreadcrumbItem>
                                );
                            })}
                        </BreadcrumbList>
                </Breadcrumb>

            </div>
        </header>
    )
}