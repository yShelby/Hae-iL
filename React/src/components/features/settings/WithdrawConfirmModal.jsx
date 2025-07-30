import React, { useState } from 'react';
import { showToast } from '@shared/UI/Toast.jsx';
import Button from "@shared/styles/Button.jsx";
import {IconLockSquare} from "@tabler/icons-react";

function WithdrawConfirmModal() {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const openModal = () => setVisible(true);
    const closeModal = () => setVisible(false);

    const handleWithdraw = async () => {
        if (!window.confirm('정말 해일을 떠나시겠습니까?')) return;

        setLoading(true);
        try {
            const res = await fetch('/api/user/withdraw', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
            });
            const data = await res.json();

            if (res.ok && data.success) {
                showToast.success('회원 탈퇴가 완료되었습니다. 메인 페이지로 이동합니다.');
                window.location.href = '/';
            } else {
                showToast.error(data.message || '회원 탈퇴에 실패했습니다.');
            }
        } catch (error) {
            console.error('회원 탈퇴 오류:', error);
            showToast.error('회원 탈퇴 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
            closeModal();
        }
    };

    if (!visible) return (
        <div className={'open-password-modal'}>
            <Button variant="button4" icon={IconLockSquare} onClick={openModal} style={{ marginLeft: '15px'}}>
                {/*<Button onClick={openModal} style={{ marginBottom: '2rem' }}>*/}
            </Button>
            <div style={{flex:'1', textAlign:'center'}}>회원 탈퇴</div>
        </div>
        // <button onClick={openModal} style={{ color: 'red' }}>
        //     회원 탈퇴
        // </button>
    );

    return (
        <div className="modal-overlay" style={modalOverlayStyle}>
            <div className="modal-content" style={modalContentStyle}>
                <h3>회원 탈퇴</h3>
                <p>정말 해일을 떠나시겠습니까?</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={closeModal} disabled={loading}>
                        취소
                    </button>
                    <button onClick={handleWithdraw} disabled={loading} style={{ color: 'red' }}>
                        탈퇴하기
                    </button>
                </div>
            </div>
        </div>
    );
}

const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    width: '300px',
};

const openPasswordModal={
    width:'230px', height:'60px', backgroundColor:'#fff', display:'flex', alignItems:'center', justifyContent:'space-evenly',
}

export default WithdrawConfirmModal;
