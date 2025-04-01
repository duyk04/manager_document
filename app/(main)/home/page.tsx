import { currentProfile } from "@/lib/current-profile";

import Image from "next/image";
import Link from "next/link";

const HomePage = async () => {
	return (
		<div className="flex flex-col md:flex-row items-center justify-center bg-gray-100 h-full p-4">
			<div className="flex-1 text-center md:text-left p-6">
				<h1 className="text-5xl font-bold mb-4">
					Hệ thống quản lý
					<br /> văn bản và minh chứng
				</h1>
				<p className="text-lg text-gray-700 mb-6">

				</p>
				<div className="flex gap-4 justify-center md:justify-start">
					<button className="bg-black text-white px-6 py-2 rounded-md">Thông tin</button>
					<Link href="https://docs.google.com/spreadsheets/d/1UerbvAr6-qJwqPpMaPcGfXpaKeIYdL0blR92AX_A9fU/edit?gid=1650437734#gid=1650437734" target="_blank" rel="noopener noreferrer">
						<button className="border-2 border-black px-6 py-2 rounded-md">Góp ý →</button>
					</Link>
				</div>
			</div>
			<div className="flex-1 grid grid-cols-3 gap-4 p-6">
				<div className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
					<Image
						src="/images/hunre.jpg"
						alt="Background"
						fill
						style={{ objectFit: "cover" }}
						className="w-full h-full object-cover hover:scale-110 duration-500"
					/>
				</div>
				<div className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
					<Image
						src="/images/anh_1.jpg"
						alt="Background"
						fill
						style={{ objectFit: "cover" }}
						className="w-full h-full object-cover hover:scale-110 duration-500"
					/>
				</div>
				<div className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
					<Image
						src="/images/anh_2.jpg"
						alt="Background"
						fill
						style={{ objectFit: "cover" }}
						className="w-full h-full object-cover hover:scale-110 duration-500"
					/>
				</div>
				<div className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
					<Image
						src="/images/anh_3.jpg"
						alt="Background"
						fill
						style={{ objectFit: "cover" }}
						className="w-full h-full object-cover hover:scale-110 duration-500"
					/>
				</div>
				<div className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
					<Image
						src="/images/anh_4.jpg"
						alt="Background"
						fill
						style={{ objectFit: "cover" }}
						className="w-full h-full object-cover hover:scale-110 duration-500"
					/>
				</div>
				<div className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
					<Image
						src="/images/anh_5.jpg"
						alt="Background"
						fill
						style={{ objectFit: "cover" }}
						className="w-full h-full object-cover hover:scale-110 duration-500"
					/>
				</div>
				<div className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
					<Image
						src="/images/anh_6.jpg"
						alt="Background"
						fill
						style={{ objectFit: "cover" }}
						className="w-full h-full object-cover hover:scale-110 duration-500"
					/>
				</div>
				<div className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
					<Image
						src="/images/hunre.jpg"
						alt="Background"
						fill
						style={{ objectFit: "cover" }}
						className="w-full h-full object-cover hover:scale-110 duration-500"
					/>
				</div>
				<div className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
					<Image
						src="/images/anh_3.jpg"
						alt="Background"
						fill
						style={{ objectFit: "cover" }}
						className="w-full h-full object-cover hover:scale-110 duration-500"
					/>
				</div>
			</div>
		</div>
	);
}

export default HomePage;
