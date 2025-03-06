import {
	AudioWaveform,
	BookOpen,
	Bot,
	Command,
	Frame,
	GalleryVerticalEnd,
	Map,
	PieChart,
	Settings2,
	SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/navigation/nav-main"
import { NavAdmin } from "@/components/navigation/nav-admin"
import { NavUser } from "@/components/navigation/nav-user"
import { TeamSwitcher } from "@/components/navigation/team-switcher"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar"
import { currentProfile } from "@/lib/current-profile"
import { VaiTro } from "@prisma/client"

export async function AppSidebar() {
	const profile = await currentProfile()
	const role = profile?.vaiTro;
	const isAdmin = role === VaiTro.QUANTRIVIEN || role === VaiTro.THANHTRA || role === VaiTro.QUANLY;
	return (
		<Sidebar collapsible="icon" >
			<SidebarHeader>
				<TeamSwitcher />
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
				{isAdmin && (
					<NavAdmin />
				)}
			</SidebarContent>
			<SidebarFooter>
				<NavUser profileUser={profile} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
