import { NoAccess } from "@/components/notification_ui/notification";
import { CreateProofDocumentModal } from "@/components/proofDocuments/proofDocument-creat";
import { currentProfile } from "@/lib/current-profile";

const ProofDocumentPage = async () => {
	const profile = await currentProfile();
	if (profile?.trangThai === false) {
		return (<><NoAccess /></>)
	}
	return (
		<CreateProofDocumentModal />
	);
}

export default ProofDocumentPage;
