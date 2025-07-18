import { gsap } from 'gsap';
import { Observer } from "gsap/Observer";
import {useEffect, useRef} from "react";
import throttle from 'lodash.throttle';
import {useScrollAnimation} from "@/hooks/useScrollAnimation.js";

// GSAP에 Observer 플러그인을 등록. 이 작업은 한 번만 수행하면 된다.
gsap.registerPlugin(Observer);

/**
 * 전체 화면 스크롤(가상 스크롤)을 제어하는 커스텀 훅.
 * GSAP의 Observer를 사용하여 스크롤 및 터치 이벤트를 감지하고,
 * 페이지 전환을 트리거
 */
export const useVirtualScroll = () => {
    // 이전에 만든 Context로부터 페이지 전환 함수와 상태를 가져온다.
    const { currentPageIndex, isAnimating, navigateToPage } = useScrollAnimation();
    const observerRef = useRef(null);

    useEffect(() => {
        /**
         * 스크롤 이벤트를 처리하는 함수.
         * lodash.throttle을 사용하여 1.5초에 한 번만 실행되도록 제한
         * @param {'up' | 'down'} direction - 스크롤 방향
         */
        const handleScroll = throttle((direction) => {
            // 다른 애니메이션이 실행 중이면 아무 작업도 수행 x
            if (isAnimating) return;

            if (direction === 'down') {
                // 아래로 스크롤 시, 다음 페이지로 이동
                navigateToPage(currentPageIndex + 1);
            } else if (direction === 'up') {
                // 위로 스크롤 시, 이전 페이지로 이동
                navigateToPage(currentPageIndex - 1);
            }
        }, 1500, { trailing: false, leading: true }); // 1.5초 간격으로, 이벤트 시작 시점에만 호출

        // GSAP Observer를 생성
        observerRef.current = Observer.create({
            target: window, // 전체 창의 이벤트를 감지
            type: 'wheel,touch,pointer', // 감지할 이벤트 타입 (마우스 휠, 터치, 포인터)
            onDown: () => handleScroll('down'), // 아래로 스크롤/스와이프 시 호출
            onUp: () => handleScroll('up'),     // 위로 스크롤/스와이프 시 호출
            preventDefault: true, // 브라우저의 기본 스크롤 동작을 막습니다. (가상 스크롤의 핵심)
        });

        // 컴포넌트가 언마운트될 때 Observer와 throttle을 정리하여 메모리 누수를 방지
        return () => {
            observerRef.current?.kill();
            handleScroll.cancel();
        };
    }, [currentPageIndex, isAnimating, navigateToPage]);
};
