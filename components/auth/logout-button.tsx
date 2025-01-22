"use client";

import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export const LogoutButton = () => {
	const onClickSignOut = async () => {
		try {
			await signOut();
		}catch (error) {
            console.error("Failed to sign out", error);
        }
        finally {
			redirect("/auth/login");
		}
	};

	return (
		<button onClick={onClickSignOut} className="flex items-center w-full">
			Log out
		</button>
	);
};
