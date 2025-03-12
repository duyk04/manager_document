import PersonalProfileInformation from "@/components/profile/personal-profile-information";
import { currentProfile } from "@/lib/current-profile";

const Profile = async () => {
    const profile = await currentProfile();

    // console.log(profile);


    return (
        <div className="flex flex-col items-center">
            <PersonalProfileInformation user={profile} />
        </div>

    )
}

export default Profile;