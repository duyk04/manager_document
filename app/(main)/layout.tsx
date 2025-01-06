import { NavigationNavbar } from "@/components/navigation/navigaton-navbar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full">
            <div className="flex justify-center w-full text-white fixed top-0 z-50 bg-white dark:bg-black dark:text-white">
                <NavigationNavbar />
            </div>

            <div className="w-full mt-[4rem]">
                {children}
            </div>
        </div>
    );
}

export default MainLayout;