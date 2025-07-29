import React, {createContext, useContext, useEffect, useState} from "react";
import {themes} from "@shared/styles/themes.js";

// 테마 변경 예시(참고용) <button onClick={() => setThemeKey('theme1')}>테마 1</button>
const ThemeContext = createContext(themes.theme1);

export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({ children, initialTheme = 'theme1' }) {
    const [themeKey, setThemeKey] = useState(initialTheme);
    const theme = themes[themeKey] || themes.theme1;

    useEffect(() => {
        const root = document.documentElement;
        const colors = theme.colors;

        root.className = themeKey; // html 태그에 테마 클래스 추가

        root.style.setProperty('--primary-color', colors.main)
        root.style.setProperty('--primary-color-rgb', colors.rgb);
        root.style.setProperty('--sidebar-text', theme.sideText)
        // root.style.setProperty('--main-bg', colors.background)
        root.style.setProperty('--border-radius-main', theme.borderRadius)
        root.style.setProperty('--shadow-main', theme.shadow)
        root.style.setProperty('--border-gradient', colors.gradient);
        root.style.backgroundImage = colors.gradient // 배경 그라디언트도 동적으로
    }, [theme])

    return (
        <ThemeContext.Provider value={{ theme, themeKey, setThemeKey }}>
            {children}
        </ThemeContext.Provider>
    )
}
// 사용법: <ThemeProvider><App /></ThemeProvider>
