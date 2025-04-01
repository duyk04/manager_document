"use client"

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	useSidebar,
} from "@/components/ui/sidebar"

import {
	Frame,
	ChevronRight,
	Folder,
	Forward,
	MoreHorizontal,
	Trash2,
	CircleUser,
	BookMarked,
	ListCollapse
} from "lucide-react"


const projects = [
	{
		name: "Setting",
		url: "#",
		icon: Frame,
	}
]

const navAdmin = [
	{
		title: "Quản lý tài khoản",
		url: "#",
		icon: CircleUser,
		isActive: false,
		items: [
			{
				title: "Danh sách",
				url: "/admin/account",
			},
			{
				title: "Thêm mới",
				url: "/admin/account/create-account",
			},
		],
	},
	{
		title: "Quản lý khoa",
		url: "#",
		icon: BookMarked,
		items: [
			{
				title: "Danh sách",
				url: "/admin/department",
			},
			{
				title: "Thêm mới",
				url: "#",
			},
		],
	},
	{
		title: "Quản danh mục văn bản",
		url: "#",
		icon: ListCollapse,
		items: [
			{
				title: "Lĩnh vực",
				url: "/admin/field",
			},
			{
				title: "Loại văn bản",
				url: "/admin/type",
			},
			{
				title: "Cấp ban hành",
				url: "/admin/release-level",
			},
		],
	},
]

export function NavAdmin() {
	const { isMobile } = useSidebar()

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Admin</SidebarGroupLabel>
			<SidebarMenu>
			{navAdmin.map((item) => (
					<Collapsible
						key={item.title}
						asChild
						defaultOpen={item.isActive}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger asChild>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<p className="w-64 overflow-hidden whitespace-nowrap text-ellipsis">{item.title}</p>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => (
										<SidebarMenuSubItem key={subItem.title}>
											<SidebarMenuSubButton asChild>
												<a href={subItem.url}>
													<span>{subItem.title}</span>
												</a>
											</SidebarMenuSubButton>
										</SidebarMenuSubItem>
									))}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
				{/* {projects.map((item) => (
					<SidebarMenuItem key={item.name}>
						<SidebarMenuButton asChild>
							<a href={item.url}>
								<item.icon />
								<span>{item.name}</span>
							</a>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover>
									<MoreHorizontal />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-48 rounded-lg"
								side={isMobile ? "bottom" : "right"}
								align={isMobile ? "end" : "start"}
							>
								<DropdownMenuItem>
									<Folder className="text-muted-foreground" />
									<span>View Project</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Forward className="text-muted-foreground" />
									<span>Share Project</span>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>
									<Trash2 className="text-muted-foreground" />
									<span>Delete Project</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))} */}
				<SidebarMenuItem>
					<SidebarMenuButton className="text-sidebar-foreground/70">
						<MoreHorizontal className="text-sidebar-foreground/70" />
						<span>More</span>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarGroup>
	)
}
