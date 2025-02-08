import NavigationNavbar from "@/components/navigation/navigaton-navbar";
import { currentProfile } from "@/lib/current-profile";
import { AppSidebar } from "@/components/navigation/app-sidebar"

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { NavHeader } from "@/components/navigation/nav-header";


const MainLayout = async ({
    children
}: { children: React.ReactNode }) => {
    const profile = await currentProfile();
    return (
        <div className="h-full">
            {/* <div className="flex justify-center w-full text-white fixed top-0 z-50 bg-white dark:bg-black dark:text-white">
                <NavigationNavbar name={profile?.hoTen} role={profile?.vaiTro} />
            </div>

            <div className="w-full mt-[4rem]">
                {children}
            </div> */}
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <NavHeader />
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-[4rem]">
                        {children}
                        {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3 bg">
                            <div className="aspect-video rounded-xl bg-muted/50" />
                            <div className="aspect-video rounded-xl bg-muted/50" />
                            <div className="aspect-video rounded-xl bg-muted/50" />
                        </div>
                        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" /> */}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}

export default MainLayout;