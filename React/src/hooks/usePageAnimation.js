import { useLocation } from 'react-router-dom';
import { scrollVariants, fadeVariants, slideVariants } from '@shared/animation/animation-variants';

export const usePageAnimation = () => {
    const location = useLocation();
    // navigate 함수의 state 객체에서 애니메이션 타입을 가져온다.
    const animationType = location.state?.animationType;

    let currentVariants;

    // 전달받은 animationType에 따라 적절한 variant를 선택
    switch (animationType) {
        case 'fade':
            currentVariants = fadeVariants;
            break;
        case 'slideLeft':
            currentVariants = slideVariants.slideLeft;
            break;
        case 'slideRight':
            currentVariants = slideVariants.slideRight;
            break;
        case 'scroll':
            currentVariants = scrollVariants;
            break;
        default:
            // 명시된 타입이 없거나, URL을 직접 입력해 들어온 경우 기본값으로 'scroll'을 사용
            currentVariants = scrollVariants;
            break;
    }

    // motion 컴포넌트에 전달할 props 객체를 반환
    return {
        key: location.pathname, // AnimatePresence가 페이지 변경을 감지하도록 key를 전달
        variants: currentVariants,
        initial: "initial",
        animate: "animate",
        exit: "exit",
    };
};