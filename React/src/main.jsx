// 📦 React 및 DOM 렌더링 관련 라이브러리
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 🎨 전역 스타일
import {GalleryProvider} from "@features/gallery/GalleryContext.jsx";
import App from "@/App.jsx";
import {AuthProvider} from "@shared/context/AuthContext.jsx";
import ThemeProvider from "@shared/styles/ThemeProvider.jsx";

// 🧱 1. 루트 DOM 요소 가져오기
const root = ReactDOM.createRoot(document.getElementById('react-root'));

const queryClient = new QueryClient();

// ⚙️ 2. 애플리케이션 렌더링
root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            {/* 🌍 3. 전체 라우터 감싸기: URL 기반 라우팅 기능 활성화 */}
            <BrowserRouter>
                <ThemeProvider>
                    <AuthProvider>
                        {/* 🖼️ 4. 갤러리 상태 전역 관리 */}
                        <GalleryProvider>
                            {/* [추가] App 컴포넌트를 ScrollAnimationProvider로 감싸준다.
                               - App 컴포넌트 및 그 하위의 모든 컴포넌트들이 라우팅 정보(useLocation)와
                               - 애니메이션 상태(isAnimating)에 접근해야 하므로, 라우터(BrowserRouter)의
                               - 자식 요소이면서 App의 부모 요소 위치에 Provider를 추가 필요
                            */}
                                {/* 🧩 5. 실제 앱 컴포넌트 렌더링 */}
                                <App/>
                        </GalleryProvider>
                    </AuthProvider>
                </ThemeProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
