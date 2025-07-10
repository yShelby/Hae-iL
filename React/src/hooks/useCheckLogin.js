// 📁 src/hooks/useCheckLogin.js
import { useRef } from 'react';
import { useAuth } from '@features/auth/AuthContext.jsx';
import { showToast } from '@shared/UI/Toast.jsx';

export function useCheckLogin() {
    const { user } = useAuth();
    const toastShownRef = useRef(false);

    function checkLogin() {
        if (!user) {
            if (!toastShownRef.current) {
                showToast.error('로그인이 필요합니다.');
                toastShownRef.current = true;
            }
            return false;
        }
        return true;
    }

    return checkLogin;
}
