import RegisterForm from "@/components/auth/register-form";
import Link from "next/link";

const RegisterPage = () => {
	return (
		<div className="flex min-h-screen flex-col lg:flex-row">
			{/* Left Section */}
			<div className="lg:w-2/5 bg-white flex flex-col justify-center items-center p-8">
				<div className="w-full max-w-md">
					{/* Logo */}
					<div className="mb-6">
						<img src="https://placehold.co/40" alt="Logo" className="h-10" />
					</div>
					{/* Title */}
					<h1 className="text-2xl font-bold mb-4 text-gray-800">
						Create an account
					</h1>
					<p className="text-sm text-gray-500 mb-8">
						Đã có tài khoản{" "}
						<Link href="/auth/login" className="text-indigo-600 hover:underline">
							Đăng nhập ngay
						</Link>
					</p>
					{/* Form */}
					<RegisterForm />
					{/* Divider */}
					<div className="mt-6 flex items-center">
						<div className="border-t border-gray-300 flex-grow" />
						<p className="text-sm text-gray-500 mx-4">Or continue with</p>
						<div className="border-t border-gray-300 flex-grow" />
					</div>
					{/* Social Login */}
					<div className="mt-6 flex gap-4">
						<button className="flex items-center justify-center w-full border border-gray-300 py-2 px-4 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
							{/* <img
								src="https://placehold.co/20"
								alt="Google"
								className="h-5 mr-2"
							/> */}
							<svg
								className="h-5 w-5 mr-2"
								xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
								<path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
							</svg>
							Google
						</button>
						{/* <button className="flex items-center justify-center w-full border border-gray-300 py-2 px-4 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
							<img
								src="https://placehold.co/20"
								alt="GitHub"
								className="h-5 mr-2"
							/>
							GitHub
						</button> */}
					</div>
				</div>
			</div>
			{/* Right Section */}
			<div className="lg:w-3/5 hidden lg:block">
				<img
					src="https://placehold.co/800x600"
					alt="Background"
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	);
}
export default RegisterPage;