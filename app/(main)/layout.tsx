import { NavigationNavbar } from "@/components/navigation/navigaton-navbar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
    return (  
        <div className="h-full">
            <div className="flex justify-center w-full py-3 bg-black text-white">
                <div>
                   <NavigationNavbar/>
                </div>
            </div>

            <div className="w-full">
                {children}
            </div>
        </div>
    );
}

export default MainLayout;