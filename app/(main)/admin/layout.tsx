import { AppSidebar } from "@/components/admin/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const MainLayout = async ({
    children
}: { children: React.ReactNode }) => {

    return (
        <div className="h-full justify-center flex">
            {/* <SidebarProvider> */}
            {/* <Separator orientation="vertical" />
                    <AppSidebar />
                    <Separator orientation="vertical" /> */}
            <div className="w-full p-5">
                {/* <SidebarTrigger /> */}
                {children}
            </div>
            {/* </SidebarProvider> */}

        </div>
    );
}

export default MainLayout;