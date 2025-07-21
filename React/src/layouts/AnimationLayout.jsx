import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { usePageAnimation } from '@/hooks/usePageAnimation.js';

const AnimationLayout = () => {
    // usePageAnimation 훅을 호출하여 애니메이션 props를 가져옵니다.
    const animationProps = usePageAnimation();
    // key를 분리하여 직접 전달
    const { key, ...restAnimationProps } = animationProps;

    const handleAnimationComplete = () => {
        // 일부 컴포넌트(WordCloud 등)의 리사이즈를 위한 이벤트
        window.dispatchEvent(new Event('layoutAnimationComplete'));
    };

    return (
        // 이 컴포넌트가 모든 자식 페이지의 애니메이션을 담당합니다.
        <Motion.div
            key={key}
            style={{ height: '100%', width: '100%' }} // 부모(main-content-area)를 꽉 채우도록 설정
            {...restAnimationProps}
            onAnimationComplete={handleAnimationComplete}
        >
            <Outlet />
        </Motion.div>
    );
};

export default AnimationLayout;