"use client"

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
	Settings2,
	BookText,
	BookCheck,
	ChevronRight,
	ListCheck,
	University,
	Archive,
	ListCollapse,
	House
} from "lucide-react"

const navMain = [
	{
		title: "Trang chủ",
		url: "#",
		icon: House,
		isActive: false,
		items: [
			{
				title: "Giới thiệu",
				url: "/home",
			},
			{
				title: "Hướng dẫn",
				url: "#",
			},
			{
				title: "Tin tức",
				url: "#",
			},
		],
	},
	{
		title: "Đánh giá CTDT",
		url: "#",
		icon: ListCheck,
		items: [
			{
				title: "Danh sách",
				url: "#",
			},
			{
				title: "Thêm mới",
				url: "#",
			},
			{
				title: "Quantum",
				url: "#",
			},
		],
	},
	{
		title: "Đánh giá cơ sở đào tạo",
		url: "#",
		icon: University,
		items: [
			{
				title: "Danh sách",
				url: "#",
			},
			{
				title: "Thêm mới",
				url: "#",
			},
			{
				title: "Quantum",
				url: "#",
			},
		],
	},
	{

		title: "Quản lý văn bản",
		url: "#",
		icon: BookText,
		items: [
			{
				title: "Danh sách",
				url: "/document/view",
			},
			{
				title: "Thêm mới",
				url: "/document",
			},
			{
				title: "Settings",
				url: "#",
			},
		],
	},
	{

		title: "Quản lý tiêu chuẩn",
		url: "#",
		icon: BookText,
		items: [
			{
				title: "Danh sách",
				url: "/document/view",
			},
			{
				title: "Thêm mới",
				url: "/document",
			},
			{
				title: "Settings",
				url: "#",
			},
		],
	},
	{
		title: "Quản lý minh chứng",
		url: "#",
		icon: BookCheck,
		items: [
			{
				title: "Danh sách",
				url: "#",
			},
			{
				title: "Thêm mới",
				url: "#",
			},
			{
				title: "Quantum",
				url: "#",
			},
		],
	},
	{
		title: "Kho dữ liệu chung",
		url: "#",
		icon: Archive,
		items: [
			{
				title: "Introduction",
				url: "#",
			},
			{
				title: "Get Started",
				url: "#",
			},
			{
				title: "Tutorials",
				url: "#",
			},
			{
				title: "Changelog",
				url: "#",
			},
		],
	},
	{
		title: "Danh mục",
		url: "#",
		icon: ListCollapse,
		items: [
			{
				title: "Danh sách",
				url: "#",
			},
			{
				title: "Thêm mới",
				url: "#",
			},
			{
				title: "Quantum",
				url: "#",
			},
		],
	},
	{
		title: "Settings",
		url: "#",
		icon: Settings2,
		items: [
			{
				title: "General",
				url: "#",
			},
			{
				title: "Team",
				url: "#",
			},
			{
				title: "Billing",
				url: "#",
			},
			{
				title: "Limits",
				url: "#",
			},
		],
	},
]
export function NavMain() {
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Menu</SidebarGroupLabel>
			<SidebarMenu>
				{navMain.map((item) => (
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
			</SidebarMenu>
		</SidebarGroup>
	)
}
