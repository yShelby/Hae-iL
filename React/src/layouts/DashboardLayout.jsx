import React from 'react';
import "./css/DashboardLayout.css";
import Weather from "@features/dashboard/Weather.jsx";
import {Outlet} from "react-router-dom";
import FortuneCookie from "@features/dashboard/FortuneCookie.jsx";
import DashboardCalendar from "@features/dashboard/DashboardCalendar.jsx";
import {motion as Motion} from 'framer-motion';
import {usePageAnimation} from "@/hooks/usePageAnimation.js";

const DashboardLayout = () => {

    // const animationProps = usePageAnimation();
    // const { key, ...restAnimationProps } = animationProps; // key 분리
    //
    // /**
    //  * ✨ [추가] 애니메이션 완료 핸들러
    //  * 📌 이유: Framer Motion의 onAnimationComplete 콜백을 사용하여,
    //  * 등장 애니메이션이 완전히 끝났을 때를 감지
    //  */
    // const handleAnimationComplete = () => {
    //     /**
    //      * ✨ [추가] 커스텀 이벤트 발생
    //      * 📌 이유: 애니메이션이 끝났다는 사실을 하위 컴포넌트(WordCloudComp 등)에
    //      * 알려주기 위한 신호를 window 객체를 통해 알려준다
    //      * 이 신호를 받은 컴포넌트는 자신의 크기를 다시 측정하게 된다.
    //      */
    //     window.dispatchEvent(new Event('layoutAnimationComplete'));
    // };


    return (
        <main className="dashboard-container">
            {/* --- ⬇️ 좌측 컬럼 ⬇️ --- */}
            <div className="dashboard-left-column">
                <Outlet/>
            </div>

            {/* --- ⬇️ 우측 컬럼 ⬇️ --- */}
            <div className="dashboard-right-column">
                <div className="horizontal-container">
                    {/* "위치 정보 요청 → 백엔드 API 호출 → 외부 API 호출 → 응답"
                    과정을 거치기 때문에 1~2초 정도의 로딩이 걸린다.(정상) */}
                    <div className={"placeholder-box weather-box"}>
                        <Weather/>
                    </div>
                    <div className={"placeholder-box fortune-box"}>
                        <FortuneCookie/>
                    </div>
                </div>

                <div className="calendar-container">
                    <DashboardCalendar/>
                </div>
            </div>
        </main>
    );
};

export default DashboardLayout;
