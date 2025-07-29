import React, { useState } from 'react';
import { showToast } from '@shared/UI/Toast.jsx';

function ChangePasswordModal() {
    const [visible, setVisible] = useState(false);
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [newPwConfirm, setNewPwConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const openModal = () => setVisible(true);
    const closeModal = () => {
        setVisible(false);
        setCurrentPw('');
        setNewPw('');
        setNewPwConfirm('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPw !== newPwConfirm) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        if (newPw.length < 8) {
            setError('새 비밀번호는 8자 이상이어야 합니다.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const res = await fetch('/my-page/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    currentPassword: currentPw,
                    newPassword: newPw
                }),
            });
            const data = await res.json();

            if (data.success) {
                closeModal();
                showToast.success('비밀번호가 성공적으로 변경되었습니다. 다시 로그인 해주세요.');
                // 로그아웃 처리
                await fetch('/user/logout', { method: 'POST', credentials: 'include' });
                window.location.href = '/';
            } else {
                setError(data.message || '비밀번호 변경에 실패했습니다.');
            }
        } catch {
            setError('서버 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!visible) return (
        <button onClick={openModal} style={{ marginBottom: '2rem' }}>
            비밀번호 변경
        </button>
    );

    return (
        <div className="modal-overlay" style={modalOverlayStyle}>
            <div className="modal-content" style={modalContentStyle}>
                <h3>비밀번호 변경</h3>
                <form onSubmit={handleSubmit}>
                    <label>
                        현재 비밀번호
                        <input
                            type="password"
                            value={currentPw}
                            onChange={e => setCurrentPw(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        새 비밀번호
                        <input
                            type="password"
                            value={newPw}
                            onChange={e => setNewPw(e.target.value)}
                            required
                            minLength={8}
                            maxLength={20}
                            placeholder="8~20자 영문, 숫자, 특수문자 조합"
                        />
                    </label>
                    <label>
                        새 비밀번호 확인
                        <input
                            type="password"
                            value={newPwConfirm}
                            onChange={e => setNewPwConfirm(e.target.value)}
                            required
                        />
                    </label>
                    {error && <div className="error" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button type="button" onClick={closeModal} disabled={loading}>
                            취소
                        </button>
                        <button type="submit" disabled={loading}>
                            {loading ? '변경 중...' : '변경하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// 간단 인라인 스타일 (필요하면 CSS 분리)
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

export default ChangePasswordModal;
