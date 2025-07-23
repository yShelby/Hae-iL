import {useFortuneCookie} from "@/hooks/useFortuneCookie.js";
import {useEffect, useState} from "react";
import "./css/FortuneCookie.css";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";

const cookieImgUrl = '/images/cookie.svg';
const crackedCookieImgUrl = '/images/cracked_cookie.svg';

// [추가] 비로그인 및 쿠키 열람 후 상태를 위한 재사용 컴포넌트
// 배경 이미지를 깔고 그 위에 텍스트를 표시
const FortuneDisplay = ({ imageUrl, text, altText, isCracked = false }) => (
    <div className="fortune-img-container">
        <img
            src={imageUrl}
            alt={altText}
            className={`bg-cookie-img ${isCracked ? 'is-cracked' : ''}`}
        />
        <p className="fortune-text">{text}</p>
    </div>
);

const FortuneCookie = () => {
    const {user} = useAuth();
    const checkLogin = useCheckLogin();

    const {status, isStatusLoading, openCookie, isOpening, fortuneMessage} = useFortuneCookie();
    const [isCracked, setIsCracked] = useState(false);

    // [수정] 클릭 시 시작되는 복합 애니메이션(흔들림 -> 커지며 사라짐)을 제어하는 상태
    const [isAnimating, setIsAnimating] = useState(false);

    // 페이지가 처음 로드되거나 날짜가 바뀌었을 때 서버에서 받은 상태를 기반으로
    // '이미 열었는지' 여부만 UI에 반영하는 역할
    useEffect(() => {
        // 애니메이션이 진행 중일 때는 이 훅이 상태를 덮어쓰지 않도록 방지
        // if (isShaking) return;

        if (status) {
            setIsCracked(!status.canOpen);
        }
    }, [status]);

    // [추가] 애니메이션이 끝났을 때 호출될 함수
    const handleAnimationEnd = () => {
        // 애니메이션이 끝나면 isCracked 상태를 true로 바꿔 깨진 쿠키와 메시지를 보여준다
        setIsCracked(true);
        // isAnimating 상태를 false로 되돌려 불필요한 재렌더링을 방지
        setIsAnimating(false);
    };

    const handleCookieClick = () => {
        // 열 수 없거나, 여는 중이거나, 이미 깨진 상태면 클릭을 방지
        if (!status?.canOpen || isOpening || isCracked || isAnimating) return;

        setIsAnimating(true);

        openCookie(null, {
            onSuccess: () => {
                console.log("데이터를 성공적으로 가져왔습니다.");
            },
            onError: (e) => {
                console.error("포춘쿠키 API 호출에 실패했습니다.", e);
                // API 요청이 실패했을 경우에도 애니메이션은 멈춰야 한다.
                setIsAnimating(false);
            }
        });
    };

    // 렌더링 로직 시작
    // 1. 비로그인 상태
    if (!user) {
        return (
            <div className="fortune-cookie-container" onClick={checkLogin}>
                <FortuneDisplay
                    imageUrl={cookieImgUrl}
                    text="로그인하고 확인해보세요!"
                    altText="로그인이 필요한 포춘쿠키"
                />
            </div>
        );
    }

    // 2. 로그인 상태
    if (isStatusLoading) {
        return <div className="fortune-loading-message">불러오는 중...</div>;
    }

    // 최종적으로 보여줄 메시지를 결정
    const displayMessage = fortuneMessage || status?.message || "클릭하여 확인해보세요!";

    return (
        <div className="fortune-cookie-container">
            {/* 2-2. 쿠키를 이미 열었을 경우 (isCracked가 true) */}
            {isCracked ? (
                <FortuneDisplay
                    imageUrl={crackedCookieImgUrl}
                    text={displayMessage}
                    altText="오늘의 결과"
                    isCracked={true}
                />
            ) : (
                /* 2-3. 쿠키를 아직 열지 않았을 경우 */
                <div
                    className="cookie-image-wrapper"
                    onClick={handleCookieClick}
                    title="클릭하여 확인"
                >
                    <img
                        src={cookieImgUrl}
                        alt="포춘쿠키"
                        // [수정] isAnimating 상태에 따라 'animating' 클래스를 동적으로 추가/제거
                        className={`cookie-img ${isAnimating ? 'animating' : ''}`}
                        // [추가] CSS 애니메이션이 끝나면 handleAnimationEnd 함수를 실행
                        onAnimationEnd={handleAnimationEnd}
                    />
                </div>
            )}
        </div>
    );
}

export default FortuneCookie;