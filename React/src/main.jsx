// 📦 React 및 DOM 렌더링 관련 라이브러리
import React, {useContext} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 🎨 전역 스타일
import {GalleryProvider} from "@features/gallery/GalleryContext.jsx";
import App from "@/App.jsx";
import {AuthProvider, useAuth} from "@shared/context/AuthContext.jsx";
import ThemeProvider from "@shared/styles/ThemeProvider.jsx";

// AppWithTheme 테마 상태 전역 관리
function AppWithTheme() {
    const { user, loading } = useAuth();

    // user 가 없거나 loading 중 = 기본값 (theme1)
    const initialTheme = React.useMemo(() => {
        if (!user?.themeName) return 'theme1'; // default
        // DB theme_1 -> theme1 형태 변환
        return user.themeName.replace('_', '');
    }, [user]);

        if (loading) return <div>로딩중...</div>;

    return (
        <ThemeProvider initialTheme={initialTheme}>
            <GalleryProvider>  {/* 갤러리 상태 전역 관리*/}
                <App/>
            </GalleryProvider>
        </ThemeProvider>
    );
}

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
                        <AppWithTheme />
                    </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);
