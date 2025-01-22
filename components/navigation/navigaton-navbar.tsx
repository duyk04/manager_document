import Link from "next/link"
import { signOut } from "@/auth";
import { redirect } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { vaitro } from "@prisma/client";

interface NavigationNavbarProps {
    name?: string;
    role?: vaitro;
}

const NavigationNavbar = async ({
    name,
    role
}: NavigationNavbarProps) => {
    const isAdmin = role === vaitro.QUANTRIVIEN || role === vaitro.THANHTRA || role === vaitro.QUANLY;
    return (
        <nav className="bg-white shadow-lg w-full">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            {/* <p className="text-2xl font-bold text-emerald-600">Logo</p> */}
                            {/* <UserButton
                                afterSignOutUrl="/"
                                // afterSwitchSessionUrl="/"
                                appearance={{
                                    elements: {
                                        avatarBox: "h-[40px] w-[40px]"
                                    }
                                }}
                            /> */}
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="items-center flex-auto sm:flex">
                        <Link href="/home">
                            <p className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-xl font-medium">
                                Trang chủ
                            </p>
                        </Link>
                        <Link href="/home">
                            <p className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-xl font-medium">
                                Đánh giá cơ sở đào tạo
                            </p>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <p className=" text-gray-800  hover:text-blue-600  w-full text-xl px-3 py-3 flex items-center transition">
                                    Kho dữ liệu chung
                                    <ChevronDown className="h-5 w-5 ml-auto" />
                                </p>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Link href="/document">
                                        <p className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-xl font-medium">
                                            Tạo mới văn bản
                                        </p>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="/document/view">
                                        <p className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-xl font-medium">
                                            Danh sách văn bản
                                        </p>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Link href="/contact">
                            <p className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-xl font-medium">
                                Liên hệ
                            </p>
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <p className=" text-gray-800  hover:text-blue-600  w-full text-xl px-3 py-3 flex items-center transition">
                                    More
                                    <ChevronDown className="h-5 w-5 ml-auto" />
                                </p>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>
                                    <Link href="/about">
                                        <p className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-xl font-medium">
                                            About
                                        </p>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link href="/services">
                                        <p className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-xl font-medium">
                                            Services
                                        </p>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {isAdmin && (
                            <Link href="/admin/account">
                                <p className="text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-xl font-medium">
                                    Admin
                                </p>
                            </Link>
                        )}
                    </div>

                    {/* Action Button */}
                    <div className="hidden sm:flex items-center flex-auto justify-end">
                        <p className="text-zinc-700 px-2">
                            Xin chào {name}
                        </p>
                        <form action={async () => {
                            "use server";
                            try {
                                await signOut();
                            } finally {
                                redirect("/auth/login");
                            }

                        }}>
                            <button className="text-black" type="submit">
                                Đăng xuất
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavigationNavbar;

