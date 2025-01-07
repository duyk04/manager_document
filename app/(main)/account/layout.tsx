const MainLayout = async ({
    children
}: { children: React.ReactNode }) => {

    return (
        <div className="h-full">
            <div className="flex justify-center ">
                {children}
            </div>
        </div>
    );
}

export default MainLayout;