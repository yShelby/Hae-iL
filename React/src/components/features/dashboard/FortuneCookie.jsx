import {useFortuneCookie} from "@/hooks/useFortuneCookie.js";
import {useEffect, useState} from "react";
// import crackedCookieImg from "../../../assets/images/cracked_cookie.svg";
// import cookieImg from "../../../assets/images/cookie.svg";
import "./css/FortuneCookie.css";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";

const cookieImgUrl = '/images/cookie.svg';
const crackedCookieImgUrl = '/images/cracked_cookie.svg';

const FortuneCookie = () => {
    const {user} = useAuth();
    const checkLogin = useCheckLogin();

    const {status, isStatusLoading, openCookie, isOpening, fortuneMessage} = useFortuneCookie();
    const [isCracked, setIsCracked] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    // 페이지가 처음 로드되거나 날짜가 바뀌었을 때 서버에서 받은 상태를 기반으로
    // '이미 열었는지' 여부만 UI에 반영하는 역할
    useEffect(() => {
        // 애니메이션이 진행 중일 때는 이 훅이 상태를 덮어쓰지 않도록 방지
        if (isShaking) return;

        if (status) {
            setIsCracked(!status.canOpen);
        }
    }, [status, isShaking]);

    // 📌 [비로그인 유저]를 위한 렌더링 블록
    if (!user) {
        return (
            <div className="fortune-cookie-container">
                <div
                    // 비로그인 시에는 .disabled와 .grayscale 클래스를 모두 적용
                    className="cookie-image-container disabled grayscale"
                    title="로그인이 필요합니다"
                    onClick={checkLogin}
                >
                    <img src={cookieImgUrl} alt="포춘쿠키" className="cookie-img"/>
                </div>
                <div className="fortune-message">
                    로그인하고 확인해보세요!
                </div>
            </div>
        );
    }

    const handleCookieClick = () => {
        // 열 수 없거나, 여는 중이거나, 이미 깨진 상태면 클릭을 방지
        if (!status?.canOpen || isOpening || isCracked || isShaking) return;

        setIsShaking(true);
        openCookie(null, {
            onSuccess: () => {
                // 애니메이션 효과를 위해 약간의 딜레이 후 상태 변경
                setTimeout(() => {
                    setIsCracked(true);
                    setIsShaking(false);
                }, 2000); // 2초 후 깨진 이미지로 변경
            },
            onError: () => {
                // API 요청이 실패했을 경우에도 애니메이션은 멈춰야 한다.
                setIsShaking(false);
            }
        });
    };

    // 최종적으로 보여줄 메시지를 결정
    const displayMessage = fortuneMessage || status?.message || "클릭하여 확인해보세요!";

    return (
        <div className="fortune-cookie-container">
            <div
                // isCracked가 true가 되면 shaking 클래스가 적용되지 않도록 하여, 깨진 쿠키가 흔들리지 않게 합니다.
                className={`cookie-image-container ${isShaking && !isCracked ? 'shaking' : ''} 
                ${!status?.canOpen || isCracked ? 'disabled' : ''}`}
                onClick={handleCookieClick}
                title={status?.canOpen ? "클릭하여 운세 확인" : "오늘은 이미 확인했어요"}
            >
                <img
                    // src={isCracked ? crackedCookieImg : cookieImg}
                    src={isCracked ? crackedCookieImgUrl : cookieImgUrl}
                    alt="포춘쿠키"
                    // isCracked 상태에 따라 다른 className을 부여하여 크기 조절
                    className={isCracked ? "cracked-cookie-img" : "cookie-img"}
                />
            </div>
            <div className="fortune-message">
                {isStatusLoading && user ? "운세를 불러오는 중..." :
                    // isCracked가 true일 때만(즉, 2초 후) 최종 메시지를 보여줍니다.
                    isCracked ? displayMessage : "클릭하여 확인해보세요!"}
            </div>
        </div>
    );
}

export default FortuneCookie;