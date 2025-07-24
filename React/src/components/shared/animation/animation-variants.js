// framer-motion을 위한 애니메이션 variants 객체들을 정의

const transition = {
    duration: 0.8,
    ease: [0.6, 0, 0.01, 0.99],
};

// 1. 전체 페이지 스크롤 애니메이션
export const scrollVariants = {
    initial: {
        opacity: 0,
        y: '100vh',
        scale: 0.9,
        transition: { ...transition, duration: 0.6 },
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: transition,
    },
    exit: {
        opacity: 0,
        y: '-100vh',
        scale: 0.9,
        transition: { ...transition, duration: 0.6 },
    },
};

// 2. 페이드 인/아웃 애니메이션
export const fadeVariants = {
    initial: {
        opacity: 0,
        transition: transition,
    },
    animate: {
        opacity: 1,
        transition: transition,
    },
    exit: {
        opacity: 0,
        transition: { ...transition, duration: 0.4 },
    },
};

// 3. 슬라이드 애니메이션 (좌/우)
export const slideVariants = {
    slideLeft: {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1, transition: transition },
        exit: { x: '-100%', opacity: 0, transition: transition },
    },
    slideRight: {
        initial: { x: '-100%', opacity: 0 },
        animate: { x: 0, opacity: 1, transition: transition },
        exit: { x: '100%', opacity: 0, transition: transition },
    },
};