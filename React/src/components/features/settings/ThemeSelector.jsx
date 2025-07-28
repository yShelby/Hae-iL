import React from 'react';
import { useTheme } from '@shared/styles/ThemeProvider.jsx';
import { useAuth } from '@shared/context/AuthContext.jsx';
import { showToast } from '@shared/UI/Toast.jsx';

function ThemeSelector() {
    const { themeKey, setThemeKey } = useTheme();
    const { user, setUser } = useAuth();

    // theme mapping - DB 테마 이름: 테마 css
    const themeMap = {
        theme1: 'theme_1',
        theme2: 'theme_2',
        theme3: 'theme_3',
    };

    const handleThemeChange = async (selectedThemeKey) => {
        if (!user) {
            showToast.error('로그인이 필요합니다.');
            return;
        }

        try {
            // 1. 서버에 themeName 저장 요청
            const res = await fetch('/api/user/theme', {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ themeName: themeMap[selectedThemeKey] }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                // 2. 전역 테마 변경
                setThemeKey(selectedThemeKey);
                showToast.success('테마가 변경되었습니다.');

                // 3. AuthContext 내 사용자 state에도 반영
                setUser(prev => prev ? { ...prev, themeName: themeMap[selectedThemeKey] } : prev);
            } else {
                throw new Error(data.message || '테마 저장 실패');
            }
        } catch (error) {
            console.error('테마 변경 오류:', error);
            showToast.error(`테마 변경 실패: ${error.message}`);
        }
    };

    return (
        <div>
            <h3>디자인 테마 선택</h3>
            <button
                style={{ fontWeight: themeKey === 'theme1' ? 'bold' : 'normal' }}
                onClick={() => handleThemeChange('theme1')}
            >
                테마 1
            </button>
            <button
                style={{ fontWeight: themeKey === 'theme2' ? 'bold' : 'normal', marginLeft: '0.5rem' }}
                onClick={() => handleThemeChange('theme2')}
            >
                테마 2
            </button>
            <button
                style={{ fontWeight: themeKey === 'theme3' ? 'bold' : 'normal', marginLeft: '0.5rem' }}
                onClick={() => handleThemeChange('theme3')}
            >
                테마 3
            </button>
        </div>
    );
}

export default ThemeSelector;
