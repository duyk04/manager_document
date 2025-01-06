"use client"
import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavigationNavbar() {
    const path = usePathname();
    console.log("path", path);
    return (
        <nav className="bg-white shadow-lg w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/">
                            <p className="text-2xl font-bold text-emerald-600">My</p>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden sm:flex space-x-8 items-center">
                        <Link href="/home">
                            <p className={cn(
                                "text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-xl font-medium",
                                { "text-blue-600": path === "/home" }
                            )}>
                                Trang chủ
                            </p>
                        </Link>
                        <Link href="/home">
                            <p className={cn(
                                "text-gray-800 hover:text-blue-600 px-3 py-2 rounded-md text-xl font-medium",
                                { "text-blue-600": path === "/homess" }
                            )}>
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

                    </div>

                    {/* Action Button */}
                    <div className="hidden sm:flex items-center">
                        <Link href="/login">
                            <p className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                                Login
                            </p>
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <div className="sm:hidden flex items-center">
                        <button
                            type="button"
                            className="text-gray-800 hover:text-blue-600 focus:outline-none"
                        >
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

