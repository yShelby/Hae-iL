/**
 * @file GalleryContext.js
 * 📌 역할: 갤러리 모달의 열림/닫힘 상태를 전역에서 관리하는 React Context 모듈
 *
 * 🔄 데이터 흐름:
 *  1️⃣ GalleryProvider 컴포넌트가 상태(isGalleryOpen)와 조작함수(openGallery, closeGallery)를 관리
 *  2️⃣ Context.Provider를 통해 하위 컴포넌트에 상태와 함수를 공급
 *  3️⃣ useGallery 훅을 통해 하위 컴포넌트에서 Context 값을 안전하게 접근 및 사용
 *  4️⃣ 하위 컴포넌트에서 openGallery 호출 시 모달 열림, closeGallery 호출 시 모달 닫힘
 */

import React, { createContext, useState, useContext } from 'react';

// 1️⃣ GalleryContext 생성 - 모달 상태 공유용 Context 객체
const GalleryContext = createContext();

// 2️⃣ useGallery 훅 - Context 값 쉽게 가져오도록 커스텀 훅
export const useGallery = () => {
    const context = useContext(GalleryContext);

    // ⚠️ Provider 없이 접근 시 에러 발생시켜 안전성 보장
    if (!context) {
        throw new Error('useGallery는 GalleryProvider 내부에서 사용해야 합니다.');
    }

    // ✅ Context 값 반환 (상태 + 상태 변경 함수)
    return context;
};

// 3️⃣ GalleryProvider 컴포넌트 - 모달 상태 및 조작 함수 관리 + 하위 컴포넌트에 Context 제공
export const GalleryProvider = ({ children }) => {
    // 상태: 모달 열림 여부 관리 (false면 닫힘, true면 열림)
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    // 상태 변경 함수: 모달 열기
    const openGallery = () => setIsGalleryOpen(true);

    // 상태 변경 함수: 모달 닫기
    const closeGallery = () => setIsGalleryOpen(false);

    // Context로 공급할 값 구성
    const value = {
        isGalleryOpen,  // 현재 모달 열림 상태 (boolean)
        openGallery,    // 모달 열기 함수
        closeGallery,   // 모달 닫기 함수
    };

    // Context Provider로 자식 컴포넌트에 상태와 함수 전달
    return (
        <GalleryContext.Provider value={value}>
            {children}
        </GalleryContext.Provider>
    );
};
