import React from 'react';
import { useTheme } from '@shared/styles/ThemeProvider.jsx';
import { useAuth } from '@shared/context/AuthContext.jsx';
import { showToast } from '@shared/UI/Toast.jsx';
import Button from "@shared/styles/Button.jsx";
import './css/themeselector.css'

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
        <div className={'theme-select-list'}>
            <div className={'theme-select-title'}>디자인 테마 선택</div>
            <div className={'theme-button-box'}>
                <Button
                    variant="button3"
                    style={{ fontWeight: themeKey === 'theme1' ? 'bold' : 'normal', fontFamily:'NPSfont', fontSize:'24px' }}
                    onClick={() => handleThemeChange('theme1')}
                    className={"theme-1-change-button"}
                >
                    <img src="/images/logo1.png" alt="" style={{width:'54px', height:'45px'}}/>
                    테마 1
                </Button>
                <Button
                    variant="button3"
                    style={{ fontWeight: themeKey === 'theme2' ? 'bold' : 'normal', fontFamily:'NPSfont', fontSize:'24px' }}
                    onClick={() => handleThemeChange('theme2')}
                    className={"theme-2-change-button"}
                >
                    <img src="/images/logo1.png" alt="" style={{width:'54px', height:'45px'}}/>
                    테마 2
                </Button>
                <Button
                    variant="button3"
                    style={{ fontWeight: themeKey === 'theme3' ? 'bold' : 'normal', fontFamily:'NPSfont', fontSize:'24px' }}
                    onClick={() => handleThemeChange('theme3')}
                    className={"theme-3-change-button"}
                >
                    <img src="/images/logo2.png" alt="" style={{width:'54px', height:'45px'}}/>
                    테마 3
                </Button>
            </div>
        </div>
    );
}

export default ThemeSelector;
