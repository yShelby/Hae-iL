import React from "react";
import {useAuth} from "@shared/context/AuthContext.jsx";
import ProfileImageUploader from "@features/settings/ProfileImageUploader.jsx";
import UserProfileInfo from "@features/settings/UserProfileInfo.jsx";
import ChangePasswordModal from "@features/settings/ChangePasswordModal.jsx";
import WithdrawConfirmModal from "@features/settings/WithdrawConfirmModal.jsx";

function SettingsPage() {

    const { user, loading } = useAuth();
    
    if (loading) return <div> 로딩 중... </div>
    if (!user) {
        return <div> 로그인이 필요합니다. </div>;
    }
    
    return (
        <div className="settings-page">
            <h2>환경설정</h2>
                <ProfileImageUploader />
                <UserProfileInfo user={user} />
                <ChangePasswordModal />
                <WithdrawConfirmModal />

        </div>
    );
}

export default SettingsPage;