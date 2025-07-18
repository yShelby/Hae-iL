import {useContext} from "react";
import {ScrollAnimationContext} from "@shared/context/ScrollAnimationContext.jsx";

/**
 * ScrollAnimationContext의 값(상태 및 함수)을 쉽게 사용하기 위한 커스텀 훅.
 * @returns {{
 * isAnimating: boolean,
 * navigateToPage: (targetIndex: number) => void,
 * currentPageIndex: number
 * }}
 */
export const useScrollAnimation = () => {
    // ScrollAnimationContext를 구독합니다.
    const context = useContext(ScrollAnimationContext);

    // Context가 Provider 외부에서 사용될 경우 에러를 발생시켜 실수를 방지합니다.
    if (!context) {
        throw new Error('useScrollAnimation는 ScrollAnimationProvider 안에 있어야 합니다.');
    }

    return context;
};
