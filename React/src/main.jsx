// 📦 React 및 DOM 렌더링 관련 라이브러리
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 🌐 전역 상태 컨텍스트 (인증 / 갤러리 모달)

// 🏠 메인 앱 컴포넌트

// 🎨 전역 스타일
import './index.css';
import {GalleryProvider} from "@features/gallery/GalleryContext.jsx";
import App from "@/App.jsx";
import {AuthProvider} from "@shared/context/AuthContext.jsx";

/* =================================================================
 * 🚀 Entry Point: index.jsx
 *
 * 📌 역할:
 *  - React 앱의 루트 DOM 요소에 애플리케이션 렌더링
 *  - 전역 라우팅 및 컨텍스트 상태 제공
 *
 * 🔄 데이터 흐름:
 *  1️⃣ <React.StrictMode>: 개발 시 경고 및 안전 검사 활성화
 *     ⬇
 *  2️⃣ <BrowserRouter>: 라우팅 기능 전역 적용
 *     ⬇
 *  3️⃣ <AuthProvider>: 로그인 상태/유저정보 전역 제공
 *     ⬇
 *  4️⃣ <GalleryProvider>: 갤러리 모달 상태 전역 제공
 *     ⬇
 *  5️⃣ <App />: 전체 UI와 라우팅 렌더링
 * ================================================================= */

// 🧱 1. 루트 DOM 요소 가져오기
const root = ReactDOM.createRoot(document.getElementById('react-root'));

const queryClient = new QueryClient();

// ⚙️ 2. 애플리케이션 렌더링
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            {/* 🌍 3. 전체 라우터 감싸기: URL 기반 라우팅 기능 활성화 */}
            <BrowserRouter>
                <AuthProvider>
                    {/* 🖼️ 4. 갤러리 상태 전역 관리 */}
                    <GalleryProvider>
                        {/* 🧩 5. 실제 앱 컴포넌트 렌더링 */}
                        <App/>
                    </GalleryProvider>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
