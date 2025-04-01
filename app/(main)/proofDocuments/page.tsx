
import { NoAccess } from "@/components/notification_ui/notification";
import { ViewListProofDocument } from "@/components/proofDocuments/proofDocuments-list";
import { currentProfile } from "@/lib/current-profile";

const ProofDocumentPage = async () => {
	const profile = await currentProfile();
	if (profile?.trangThai === false) {
		return (<><NoAccess /></>)
	}
	return (
		<div className="flex flex-col items-center">
			<p className="text-start w-full font-semibold text-2xl pt-5">Danh sách minh chứng</p>
			<ViewListProofDocument />
		</div>
	);
}

export default ProofDocumentPage;
