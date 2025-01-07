import { NavigationNavbar } from "@/components/navigation/navigaton-navbar";
import { currentProfile } from "@/lib/current-profile";

const MainLayout = async ({
    children
}: { children: React.ReactNode }) => {
    const profile = await currentProfile();
    return (
        <div className="h-full">
            <div className="flex justify-center w-full text-white fixed top-0 z-50 bg-white dark:bg-black dark:text-white">
                <NavigationNavbar name={profile?.name} role={profile?.role} />
            </div>

            <div className="w-full mt-[4rem]">
                {children}
            </div>
        </div>
    );
}

export default MainLayout;