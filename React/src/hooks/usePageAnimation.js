import { useLocation } from 'react-router-dom';
import { scrollVariants, fadeVariants, slideVariants } from '@shared/animation/animation-variants';

/**
 * [추가] 애니메이션 없음을 정의하는 variants
 * opacity를 1로 고정하여 시각적 변화 없이 즉시 전환 */
const noneVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
};


export const usePageAnimation = () => {
    const location = useLocation();
    // navigate 함수의 state 객체에서 애니메이션 타입을 가져온다.
    const animationType = location.state?.animationType;

    let currentVariants;

    // 1순위: navigate state에 명시적으로 애니메이션 타입이 전달된 경우
    // 특정 UI(예: 슬라이드 메뉴)에서 다른 애니메이션을 적용하고 싶을 때를 위해 유지
    switch (animationType) {
        case 'fade':
            return { key: location.pathname, variants: fadeVariants, initial: "initial", animate: "animate", exit: "exit" };
        case 'slideLeft':
            return { key: location.pathname, variants: slideVariants.slideLeft, initial: "initial", animate: "animate", exit: "exit" };
        case 'slideRight':
            return { key: location.pathname, variants: slideVariants.slideRight, initial: "initial", animate: "animate", exit: "exit" };
        // 'scroll'을 명시적으로 요청하는 경우도 처리
        case 'scroll':
            return { key: location.pathname, variants: scrollVariants, initial: "initial", animate: "animate", exit: "exit" };
        // 애니메이션을 명시적으로 없애고 싶을 때를 위한 'none' 케이스 추가
        case 'none':
            return { key: location.pathname, variants: noneVariants, initial: "initial", animate: "animate", exit: "exit" };
    }

    // 2순위: 기본값 (스크롤 애니메이션)
    // 위에서 별도로 처리되지 않은 모든 최상위 페이지 전환에는 'scroll' 애니메이션을 기본으로 적용
    return {
        key: location.pathname,
        variants: scrollVariants,
        initial: "initial",
        animate: "animate",
        exit: "exit",
    };
};