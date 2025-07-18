import React, {createContext, useCallback, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

/**
 * @typedef {object} ScrollAnimationContextValue
 * @property {boolean} isAnimating - 현재 페이지 전환 애니메이션이 실행 중인지 여부.
 * @property {(targetIndex: number) => void} navigateToPage - 특정 인덱스의 페이지로 애니메이션과 함께 이동하는 함수.
 * @property {number} currentPageIndex - 현재 URL 경로에 해당하는 페이지의 인덱스.
 */

/**
 * 스크롤 애니메이션 상태를 공유하기 위한 Context 객체
 * @type {React.Context<ScrollAnimationContextValue|null>}
 */
export const ScrollAnimationContext = createContext(null);

// 페이지 경로의 순서를 명확하게 정의. 이 순서대로 스크롤 전환이 일어난다.
const PAGE_ROUTES = ['/', '/diary', '/journal'];

/**
 * 스크롤 애니메이션 상태를 제공하는 Provider 컴포넌트.
 * @param {{children: React.ReactNode}} props
 */
export const ScrollAnimationProvider = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // 애니메이션 중복 실행을 방지하기 위한 상태
    const [isAnimating, setIsAnimating] = useState(false);

    // 현재 URL 경로를 기반으로 현재 페이지 인덱스를 찾는다.
    const getPageIndex = (pathname) => {
        // /diary/write, /diary/1 등 /diary로 시작하는 모든 경로는 1번 인덱스로 처리
        const baseRoute = '/' + (pathname.split('/')[1] || '');
        const index = PAGE_ROUTES.indexOf(baseRoute);
        return index === -1 ? 0 : index; // 찾지 못하면 기본값 0 (홈)
    };
    const currentPageIndex = getPageIndex(location.pathname);

    /**
     * 지정된 인덱스의 페이지로 이동하는 함수.
     * @type {(targetIndex: number) => void}
     */
    const navigateToPage = useCallback((targetIndex) => {
        if (isAnimating || targetIndex < 0 || targetIndex >= PAGE_ROUTES.length) {
            return;
        }
        setIsAnimating(true);
        navigate(PAGE_ROUTES[targetIndex]);
        setTimeout(() => {
            setIsAnimating(false);
        }, 1200);
    }, [isAnimating, navigate]);

    const value = {
        isAnimating,
        navigateToPage,
        currentPageIndex,
    };

    return (
        <ScrollAnimationContext.Provider value={value}>
            {children}
        </ScrollAnimationContext.Provider>
    );
};