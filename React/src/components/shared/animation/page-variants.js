/**
 * Framer Motion을 위한 페이지 전환 애니메이션 Variants.
 * - initial: 컴포넌트가 처음 나타나기 전의 상태 (화면 아래쪽, 투명)
 * - animate: 컴포넌트가 나타날 때의 최종 상태 (제자리, 불투명)
 * - exit: 컴포넌트가 사라질 때의 최종 상태 (화면 위쪽, 투명)
 */
export const pageVariants = {
    // 1. 페이지가 처음 로드될 때의 상태
    initial: {
        opacity: 0,
        y: '80vh', // 화면 높이의 80% 아래에서 시작
        scale: 0.95, // 약간 작게 시작
    },
    // 2. 페이지가 화면에 나타날 때의 애니메이션
    animate: {
        opacity: 1,
        y: '0vh', // 제자리로 부드럽게 올라옴
        scale: 1,
        transition: {
            duration: 0.8, // 애니메이션 시간 (0.8초)
            ease: [0.6, 0.05, 0, 0.9], // 자연스러운 움직임을 위한 Easing 효과
        },
    },
    // 3. 페이지가 화면에서 사라질 때의 애니메이션
    exit: {
        opacity: 0,
        y: '-80vh', // 화면 높이의 80% 위로 사라짐
        scale: 0.95,
        transition: {
            duration: 0.6, // 사라지는 시간 (0.6초)
            ease: [0.6, 0.05, 0, 0.9],
        },
    },
};
