import { AppSidebar } from "@/components/admin/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const MainLayout = async ({
    children
}: { children: React.ReactNode }) => {

    return (
        <div className="h-full justify-center flex">
            <div className="w-4/5 flex justify-center pt-5">
                <SidebarProvider>
                    <Separator orientation="vertical" />
                    <AppSidebar />
                    <Separator orientation="vertical" />
                    <div className="w-full pl-10">
                        {/* <SidebarTrigger /> */}
                        {children}
                    </div>
                </SidebarProvider>
            </div>
        </div>
    );
}

export default MainLayout;