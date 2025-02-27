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
    return (
        <div className="h-full">
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <NavHeader/>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-[4rem] z-0">
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