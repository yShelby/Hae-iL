import React, {useState} from "react";
import {useAuth} from "@shared/context/AuthContext.jsx";
import ProfileImageUploader from "@features/settings/ProfileImageUploader.jsx";
import UserProfileInfo from "@features/settings/UserProfileInfo.jsx";
import ChangePasswordModal from "@features/settings/ChangePasswordModal.jsx";
import WithdrawConfirmModal from "@features/settings/WithdrawConfirmModal.jsx";
import InitialSurveyChange from "@features/settings/InitialSurveryChange.jsx";
import ThemeSelector from "@features/settings/ThemeSelector.jsx";

function SettingsPage() {

    const { user, loading } = useAuth();
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);
    
    if (loading) return <div> 로딩 중... </div>
    if (!user) {
        return <div> 로그인이 필요합니다. </div>;
    }
    
    return (
        <div className="settings-page">
            <h2>환경설정</h2>
                <div className={'box A'} style={organizingBox}>
                    <h2>my info</h2>
                    <ProfileImageUploader />
                    <UserProfileInfo user={user} />
                </div>
                <div className={'box B'} style={organizingBox}>
                    <h2>hot lines</h2>
                </div>
                <div className={'box C'} style={organizingBox}>
                    <h2>team info</h2>
                </div>
                <div className={'box D'} style={organizingBox}>
                    <h2>app themes</h2>
                    <ThemeSelector />
                </div>
                <div className={'box E'} style={organizingBox}>
                    <h2> settings </h2>
                    <ChangePasswordModal />
                    <WithdrawConfirmModal />
                    <button onClick={() => setIsSurveyOpen(true)}>
                        설문 정보 수정하기
                    </button>
                </div>

                <InitialSurveyChange
                    open={isSurveyOpen}
                    onClose={() => setIsSurveyOpen(false)}
                    onSaved={() => {
                        // 저장 후 사용자 최신화 위해 새로고침 -> UX 개선 필요
                        window.location.reload();
                    }}
                />

        </div>
    );
}

export default SettingsPage;

const organizingBox = {
    display: 'flex',
    minWidth: '200px',minHeight: '50px',
    marginLeft: '10rem',
    border: '3px dotted #fff',
    backgroundColor: 'rgb(255 255 255 /0.15)',
};