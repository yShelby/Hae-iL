import React, {useState} from "react";
import {useAuth} from "@shared/context/AuthContext.jsx";
import ProfileImageUploader from "@features/settings/ProfileImageUploader.jsx";
import UserProfileInfo from "@features/settings/UserProfileInfo.jsx";
import ChangePasswordModal from "@features/settings/ChangePasswordModal.jsx";
import WithdrawConfirmModal from "@features/settings/WithdrawConfirmModal.jsx";
import InitialSurveyChange from "@features/settings/InitialSurveryChange.jsx";
import ThemeSelector from "@features/settings/ThemeSelector.jsx";
import LegalCopyright from "@features/settings/LegalCopyright.jsx";
import LegalPrivacyPolicy from "@features/settings/LegalPrivacyPolicy.jsx";
import TeamHaeilInfo from "@features/settings/TeamHaeilInfo.jsx";
import Button from "@shared/styles/Button.jsx";
import { IconLockSquare, IconCheckbox, IconInfoCircle} from '@tabler/icons-react';

function SettingsPage() {

    const { user, loading } = useAuth();
    const [isSurveyOpen, setIsSurveyOpen] = useState(false);
    const [isCopyrightOpen, setIsCopyrightOpen] = useState(false);
    const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);

    if (loading) return <div> 로딩 중... </div>
    if (!user) {
        return (
            <div className="settings-page" >
                {/*<h2>환경설정</h2>*/}
                <div className={"setting-left"}>
                    <div className={'box-A'}>
                        <h2>my info</h2>
                        <div> 로그인이 필요합니다. </div>
                    </div>
                    <div className={"setting-bottom"}>
                        <div className={'box-D'}>
                            {/*<h2>app themes</h2>*/}
                            <ThemeSelector />
                        </div>
                        <div className={"setting-bottom-left"}>
                            <div className={'box-B'}>
                                <h2>hot lines</h2>
                                <p>
                                    1577-0199 | 정신건강위기 상담전화 <br/>
                                    129 | 보건복지콜센터(보건복지부) <br/>
                                    1393 | 자살상담전화(보건복지부) <br/>
                                    1588-9191 | 한국생명의전화 <br/>
                                    1388 | 청소년전화(여성가족부) <br/>
                                </p>
                            </div>
                            <div className={'box-C'}>
                                <h2>팀 해일</h2>
                                <TeamHaeilInfo />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'box-E'}>
                    <h2> 계정 관리 </h2>
                    <div className={'set-list'}>
                        <div className={'open-password-modal'}>
                            <Button variant="button4" icon={IconInfoCircle} onClick={() => setIsCopyrightOpen(true)}>
                                {/*<Button onClick={openModal} style={{ marginBottom: '2rem' }}>*/}
                            </Button>
                            <div style={{flex:'1', textAlign:'center'}}>서비스 이용 약관</div>
                        </div>
                        <div className={'open-password-modal'}>
                            <Button variant="button4" icon={IconLockSquare} onClick={() => setIsPrivacyPolicyOpen(true)}>
                                {/*<Button onClick={openModal} style={{ marginBottom: '2rem' }}>*/}
                            </Button>
                            <div style={{flex:'1', textAlign:'center'}}>개인정보 이용방침</div>
                        </div>
                    </div>
                </div>

                <LegalCopyright
                    open={isCopyrightOpen}
                    onClose={()=> setIsCopyrightOpen(false)}
                />
                <LegalPrivacyPolicy
                    open={isPrivacyPolicyOpen}
                    onClose={()=> setIsPrivacyPolicyOpen(false)}
                />
            </div>
        );
    }

    return (
        <>
            {/*<h2>환경설정</h2>*/}
            <div className="settings-page" >
                {/*<h2>my info</h2>*/}
                <div className={"setting-left"}>
                    <div className={'box-A'}>
                        <ProfileImageUploader />
                        <UserProfileInfo user={user} />
                    </div>
                    <div className={"setting-bottom"}>
                        <div className={'box-D'}>
                            {/*<h2>app themes</h2>*/}
                            <ThemeSelector />
                        </div>
                        <div className={"setting-bottom-left"}>
                            <div className={'box-B'} >
                                <h2>hot lines</h2>
                                <p>
                                    1577-0199 | 정신건강위기 상담전화 <br/>
                                    129 | 보건복지콜센터(보건복지부) <br/>
                                    1393 | 자살상담전화(보건복지부) <br/>
                                    1588-9191 | 한국생명의전화 <br/>
                                    1388 | 청소년전화(여성가족부) <br/>
                                </p>
                            </div>
                            <div className={'box-C'} style={{display: 'flex', flexWrap: 'wrap',}}>
                                <h2>팀 해일</h2>
                                <TeamHaeilInfo />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={'box-E'}>
                    <h2> settings </h2>
                    <div className={'set-list'}>
                        <ChangePasswordModal />
                        <div className={'open-password-modal'}>
                            <Button variant="button4" icon={IconCheckbox} onClick={() => setIsSurveyOpen(true)}>
                                {/*<Button onClick={openModal} style={{ marginBottom: '2rem' }}>*/}
                            </Button>
                            <div style={{flex:'1', textAlign:'center'}}>설문 정보 수정하기</div>
                        </div>
                        <div className={'open-password-modal'}>
                            <Button variant="button4" icon={IconInfoCircle} onClick={() => setIsCopyrightOpen(true)}>
                                {/*<Button onClick={openModal} style={{ marginBottom: '2rem' }}>*/}
                            </Button>
                            <div style={{flex:'1', textAlign:'center'}}>서비스 이용 약관</div>
                        </div>
                        <div className={'open-password-modal'}>
                            <Button variant="button4" icon={IconLockSquare} onClick={() => setIsPrivacyPolicyOpen(true)} >
                                {/*<Button onClick={openModal} style={{ marginBottom: '2rem' }}>*/}
                            </Button>
                            <div style={{flex:'1', textAlign:'center'}}>개인정보 이용방침</div>
                        </div>
                        {/*<button onClick={() => setIsSurveyOpen(true)}>*/}
                        {/*    설문 정보 수정하기*/}
                        {/*</button>*/}
                        {/*<button onClick={() => setIsCopyrightOpen(true)}>*/}
                        {/*    서비스 이용 약관*/}
                        {/*</button>*/}
                        {/*<button onClick={() => setIsPrivacyPolicyOpen(true)}>*/}
                        {/*    개인정보 이용방침*/}
                        {/*</button>*/}
                        <WithdrawConfirmModal />
                    </div>
                </div>


                <InitialSurveyChange
                    open={isSurveyOpen}
                    onClose={() => setIsSurveyOpen(false)}
                    onSaved={() => {
                        // 저장 후 사용자 최신화 위해 새로고침 -> UX 개선 필요
                        window.location.reload();
                    }}
                />
                <LegalCopyright
                    open={isCopyrightOpen}
                    onClose={()=> setIsCopyrightOpen(false)}
                />
                <LegalPrivacyPolicy
                    open={isPrivacyPolicyOpen}
                    onClose={()=> setIsPrivacyPolicyOpen(false)}
                />
            </div>
        </>
    );
}

export default SettingsPage;
