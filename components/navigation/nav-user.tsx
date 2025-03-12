import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles,
} from "lucide-react"

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogoutButton } from "../auth/logout-button";
import Image from "next/image";
import Link from "next/link";

interface UserProps {
	profileUser: any
}

export const NavUser = ({
	profileUser
}: UserProps) => {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								{/* <AvatarImage src={profileUser?.anhDaiDien} alt={profileUser?.hoTen} /> */}
								{profileUser?.anhDaiDien ? (
									<AvatarImage src={profileUser?.anhDaiDien} alt={profileUser?.hoTen}
										className="rounded-full object-cover"
									/>
								) : (
									<AvatarFallback className="rounded-lg">
										{profileUser?.hoTen
											?.split(" ") // Tách các từ trong tên thành mảng
											.filter((word: string) => word.length > 0) // Lọc bỏ khoảng trắng thừa (nếu có)
											.map((word: string, index: number, arr: string) => (index === 0 || index === arr.length - 1) ? word.charAt(0).toUpperCase() : "")
											.join("")}
									</AvatarFallback>

								)}
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{profileUser?.hoTen}</span>
								<span className="truncate text-xs">{profileUser?.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									{profileUser?.anhDaiDien ? (
										<AvatarImage src={profileUser?.anhDaiDien} alt={profileUser?.hoTen}
											className="rounded-full object-cover"
										/>
									) : (
										<AvatarFallback className="rounded-lg">
											{profileUser?.hoTen
												?.split(" ")
												.filter((word: string) => word.length > 0)
												.map((word: string, index: number, arr: string) => (index === 0 || index === arr.length - 1) ? word.charAt(0).toUpperCase() : "")
												.join("")}
										</AvatarFallback>

									)}
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{profileUser?.hoTen}</span>
									<span className="truncate text-xs">{profileUser?.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Sparkles />
								Upgrade to Pro
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<BadgeCheck />
								<Link href="/profile/information">
									Account
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCard />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Bell />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<LogOut />
							<LogoutButton />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}

