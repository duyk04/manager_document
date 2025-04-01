import "./globals.css";
import type { Metadata } from "next";

import { Open_Sans } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { Toaster } from "@/components/ui/toaster";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Manage Documents",
	description: "Hunre",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {

	return (
		<html lang="en">
			<body className={cn(font.className,
				"bg-white dark:bg-[#313338]"
			)}>
				<ModalProvider />
				<QueryProvider>
					{children}
				</QueryProvider>
				<Toaster />
			</body>
		</html>
	);
}
