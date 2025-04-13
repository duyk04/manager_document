const MainLayout = async ({
    children
}: { children: React.ReactNode }) => {

    return (
        <div className="h-full justify-center flex">
            {/* <SidebarProvider> */}
            {/* <Separator orientation="vertical" />
                    <AppSidebar />
                    <Separator orientation="vertical" /> */}
            <div className="w-full pt-5">
                {/* <SidebarTrigger /> */}
                {children}
            </div>
            {/* </SidebarProvider> */}

        </div>
    );
}

export default MainLayout;