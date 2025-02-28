import { CreateProofDocumentModal } from "@/components/proofDocuments/proofDocument-creat";
import { currentProfile } from "@/lib/current-profile";

const ProofDocumentPage = async () => {
	const profile = await currentProfile();
	if (!profile) {
		return <div>Bạn cần liên hệ quản tri viên để đăng ký tài khoản</div>
	}
	return (
		<CreateProofDocumentModal/>
	);
}

export default ProofDocumentPage;
