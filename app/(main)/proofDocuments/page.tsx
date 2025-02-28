
import { ViewListProofDocument } from "@/components/proofDocuments/proofDocuments-list";
import { currentProfile } from "@/lib/current-profile";

const ProofDocumentPage = async () => {
	const profile = await currentProfile();
	if (!profile) {
		return <div>Bạn cần liên hệ quản tri viên để đăng ký tài khoản</div>
	}

	return (
		<div className="flex flex-col items-center">
			<p className="text-start w-full font-semibold text-2xl pt-5">Danh sách minh chứng</p>
			<ViewListProofDocument />
		</div>
	);
}

export default ProofDocumentPage;
