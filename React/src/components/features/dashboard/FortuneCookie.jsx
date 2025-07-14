import {useFortuneCookie} from "@/hooks/useFortuneCookie.js";
import {useEffect, useState} from "react";
import crackedCookieImg from "../../../assets/image/cracked_cookie.svg";
import cookieImg from "../../../assets/image/cookie.svg";
import "./css/FortuneCookie.css";
import {useAuth} from "@features/auth/AuthContext.jsx";
import {showToast} from "@shared/UI/Toast.jsx";

// const cookieImgUrl = '/image/cookie.svg';
// const crackedCookieImgUrl = '/image/cracked_cookie.svg';

const FortuneCookie = () => {
    const {user} = useAuth();
    const {status, isStatusLoading, openCookie, isOpening, fortuneMessage } = useFortuneCookie();

    const [isCracked, setIsCracked] = useState(false);

    const [isShaking, setIsShaking] = useState(false);

    // 컴포넌트가 로드될 때, 오늘 이미 쿠키를 열었는지 확인하고 상태를 설정
    useEffect(() => {
        if (user && status && !status.canOpen){
            setIsCracked(true);
        }
    }, [user, status]);

    const handleCookieClick = () => {
        if (!user) {
            showToast.error("로그인이 필요합니다.");
            return;
        }
        // 열 수 없거나, 여는 중이거나, 이미 깨진 상태면 클릭을 방지
        if (!status?.canOpen || isOpening || isCracked) return;

        openCookie(null, {
            onSuccess: () => {
                // 애니메이션 효과를 위해 약간의 딜레이 후 상태 변경
                setTimeout(() => {
                    setIsCracked(true);
                    setIsShaking(false);
                }, 2000); // 2초 후 깨진 이미지로 변경
            },
            onError: () => {
                // API 요청이 실패했을 경우에도 애니메이션은 멈춰야 합니다.
                setIsShaking(false);
            }
        });
    };

    // 최종적으로 보여줄 메시지를 결정
    const displayMessage = fortuneMessage || status?.message || "쿠키를 눌러 오늘의 운세를 확인하세요!";

    return (
        <div className="fortune-cookie-container">
            <div
                className={`cookie-image-container ${isShaking ? 'shaking' : ''} ${!status?.canOpen ? 'disabled' : ''}`}
                onClick={handleCookieClick}
                title={!user ? "로그인이 필요합니다" : (status?.canOpen ? "클릭하여 운세 확인" : "오늘은 이미 확인했어요")}
            >
                <img
                    src={isCracked ? crackedCookieImg : cookieImg}
                    // src={isCracked ? crackedCookieImgUrl : cookieImgUrl}
                    alt="포춘쿠키"
                    className="cookie-img"
                />
            </div>
            <div className="fortune-message">
                {isStatusLoading && user ? "운세를 불러오는 중..." : displayMessage}
            </div>
        </div>
    );
}

export default FortuneCookie;