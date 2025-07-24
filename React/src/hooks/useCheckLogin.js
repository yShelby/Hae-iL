// 📁 src/hooks/useCheckLogin.js
// import { useRef } from 'react';
import { useAuth } from '@shared/context/AuthContext.jsx';
import { showToast } from '@shared/UI/Toast.jsx';

export function useCheckLogin() {
    const { user } = useAuth();
    // 기존의 useRef를 사용한 방식
    // 이 방식은 한 번 토스트가 뜬 후에는 toastShownRef.current가 계속 true로 남아있어,
    // 사용자가 다시 알림을 받아야 할 때도 토스트가 뜨지 않는 문제가 있었다
    // const toastShownRef = useRef(false);

    function checkLogin() {
        if (!user) {
            // if (!toastShownRef.current) {
            //     showToast.error('로그인이 필요합니다.');
            //     toastShownRef.current = true;
            // }
            /**
             * 수정 - showToast.error 호출 시, id 옵션을 추가
             * - 이유: react-hot-toast는 동일한 id를 가진 토스트가 이미 화면에 있을 경우,
             * 새로운 토스트를 생성하지 않고 기존 토스트를 업데이트
             * - 효과: 사용자가 로그인 필요 버튼을 여러 번 연속으로 클릭해도
             * "로그인이 필요합니다." 토스트는 단 하나만 유지됩니다.
             */
            showToast.error('로그인이 필요합니다.', {
                id: 'login-required-toast', // 이 토스트만의 고유한 ID 부여
            });
            return false;
        }
        return true;
    }

    return checkLogin;
}
