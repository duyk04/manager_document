"use client";


import { useRouter } from "next/navigation";

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;
}

export const LoginButton = ({
    children,
    mode = "redirect",
    asChild
}: LoginButtonProps) => {
    const router = useRouter();

    const onClick = () => {
        router.push("/auth/login");
    }

    if (mode === "modal") {
        return (
            <span>
               ToDo: Implement modal
            </span>
        );
        
    }

    return (
        <span onClick={onClick} className="cursor-pointer text-indigo-600 hover:underline">
            {children}
        </span>

    );
}
