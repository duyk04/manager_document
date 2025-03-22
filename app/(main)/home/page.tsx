
import { currentProfile } from "@/lib/current-profile";
import Image from "next/image";

const HomePage = async () => {
	const profile = await currentProfile();
	if (profile?.trangThai === false) {
		return <div>Bạn cần liên hệ quản tri viên để đăng ký tài khoản</div>
	}
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
					<button className="border-2 border-black px-6 py-2 rounded-md">Liên hệ →</button>
				</div>
			</div>
			<div className="flex-1 grid grid-cols-3 gap-4 p-6">
					<div  className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
						<Image
							src="/images/hunre.jpg"
							alt="Background"
							objectFit="cover"
							width={800}
							height={600}
							className="w-full h-full object-cover"
						/>
					</div>
					<div  className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
						<Image
							src="/images/anh_1.jpg"
							alt="Background"
							objectFit="cover"
							width={800}
							height={600}
							className="w-full h-full object-cover"
						/>
					</div>
					<div  className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
						<Image
							src="/images/anh_2.jpg"
							alt="Background"
							objectFit="cover"
							width={800}
							height={600}
							className="w-full h-full object-cover"
						/>
					</div>
					<div  className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
						<Image
							src="/images/anh_3.jpg"
							alt="Background"
							objectFit="cover"
							width={800}
							height={600}
							className="w-full h-full object-cover"
						/>
					</div>
					<div  className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
						<Image
							src="/images/anh_4.jpg"
							alt="Background"
							objectFit="cover"
							width={800}
							height={600}
							className="w-full h-full object-cover"
						/>
					</div>
					<div  className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
						<Image
							src="/images/anh_5.jpg"
							alt="Background"
							objectFit="cover"
							width={800}
							height={600}
							className="w-full h-full object-cover"
						/>
					</div>
					<div  className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
						<Image
							src="/images/anh_6.jpg"
							alt="Background"
							objectFit="cover"
							width={800}
							height={600}
							className="w-full h-full object-cover"
						/>
					</div>
					<div  className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
						<Image
							src="/images/hunre.jpg"
							alt="Background"
							objectFit="cover"
							width={800}
							height={600}
							className="w-full h-full object-cover"
						/>
					</div>
					<div  className="relative w-full h-32 md:h-48 bg-gray-300 rounded-xl shadow-lg overflow-hidden">
						<Image
							src="/images/anh_3.jpg"
							alt="Background"
							objectFit="cover"
							width={800}
							height={600}
							className="w-full h-full object-cover"
						/>
					</div>
			</div>
		</div>
	);
}

export default HomePage;
