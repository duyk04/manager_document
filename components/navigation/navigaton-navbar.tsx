"use client"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import Link from "next/link"

export function NavigationNavbar() {
    return (
        <NavigationMenu className="">
            <NavigationMenuList className="flex items-center justify-center w-full">
                <NavigationMenuItem>
                    <Link href="/home" legacyBehavior passHref >
                        <NavigationMenuLink className="text-xl mx-4">
                            Trang chủ
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>

                <NavigationMenuItem >
                    <NavigationMenuTrigger className="text-xl mx-4 bg-black">Đánh giá cơ sở đào tạo</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[1300px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            shadcn/ui
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Example
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <li title="Introduction">
                                Re-usable components built using Radix UI and Tailwind CSS.
                            </li>
                            <li title="Installation">
                                How to install dependencies and structure your app.
                            </li>
                            <li title="Typography">
                                Styles for headings, paragraphs, lists...etc
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem >
                    <NavigationMenuTrigger className="text-xl mx-4 bg-black">Đánh giá CTĐT</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[1300px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            shadcn/ui
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Example
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <li title="Introduction">
                                Re-usable components built using Radix UI and Tailwind CSS.
                            </li>
                            <li title="Installation">
                                How to install dependencies and structure your app.
                            </li>
                            <li title="Typography">
                                Styles for headings, paragraphs, lists...etc
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem >
                    <NavigationMenuTrigger className="text-xl mx-4 bg-black">Kho dữ liệu chung</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[1300px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            shadcn/ui
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Example
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <li title="Introduction">
                                <Link href="/document" legacyBehavior passHref >
                                    Thêm mới văn bản
                                </Link>
                            </li>
                            <li title="Installation">
                                How to install dependencies and structure your app.
                            </li>
                            <li title="Typography">
                                Styles for headings, paragraphs, lists...etc
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem >
                    <NavigationMenuTrigger className="text-xl mx-4 bg-black">Mạng lưới ĐBCL</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[1300px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            shadcn/ui
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Example
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <li title="Introduction">
                                Re-usable components built using Radix UI and Tailwind CSS.
                            </li>
                            <li title="Installation">
                                How to install dependencies and structure your app.
                            </li>
                            <li title="Typography">
                                Styles for headings, paragraphs, lists...etc
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem >
                    <NavigationMenuTrigger className="text-xl mx-4 bg-black">Giới thiệu</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[1300px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            shadcn/uiaaaaaa
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Example
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <li title="Introduction">
                                Re-usable components built using Radix UI and Tailwind CSS.
                            </li>
                            <li title="Installation">
                                How to install dependencies and structure your app.
                            </li>
                            <li title="Typography">
                                Styles for headings, paragraphs, lists...etc
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                
            </NavigationMenuList>
        </NavigationMenu>

    )
}
