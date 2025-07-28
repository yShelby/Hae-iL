import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * 🔐 AuthContext.js
 * ──────────────────────────────
 * ✅ 역할:
 * - 인증 상태를 전역으로 관리하는 React Context 및 Provider 컴포넌트 정의
 * - 초기 사용자 정보를 window.__USER__에서 가져와 상태로 설정
 * - 사용자 정보(user)와 로딩 상태(loading)를 하위 컴포넌트에 공급
 * - 커스텀 훅 useAuth로 Context 접근을 편리하게 처리
 *
 * 🔄 데이터 흐름도:
 * 1️⃣ AuthContext 생성 (전역 상태 저장소 역할)
 * 2️⃣ AuthProvider 컴포넌트가 마운트되면
 *    - useEffect에서 window.__USER__에서 초기 사용자 데이터 읽음
 *    - 초기값이 있으면 사용자 정보를 React 상태(user)에 세팅
 *    - 로딩 상태를 false로 변경하여 데이터 로딩 완료 알림
 * 3️⃣ value 객체(user, loading)를 Context.Provider에 전달하여 하위 컴포넌트에 공유
 * 4️⃣ useAuth 훅으로 Context를 쉽게 가져와 인증 상태를 사용할 수 있도록 지원
 */

// 1️⃣ AuthContext 생성: 인증 정보 공유용 컨테이너
const AuthContext = createContext(null);

// 2️⃣ AuthProvider 컴포넌트: 자식 컴포넌트에 인증 상태 제공
export const AuthProvider = ({ children }) => {
    // 사용자 정보 상태 저장 (초기값 null)
    const [user, setUser] = useState(null);

    // 데이터 로딩 여부 상태 저장 (초기값 true)
    const [loading, setLoading] = useState(true);

    // 컴포넌트가 처음 렌더링 될 때 사용자 정보를 window.__USER__에서 로드
    useEffect(() => {
        const initialUser = window.__USER__ || null;

        // console.log('✅ window.__USER__:', initialUser);
        const isValidUser = initialUser &&
            initialUser.userId !== null &&
            initialUser.email !== null;

        if (isValidUser) {
            // 🧩 window.__USER__의 필드를 프론트용 user 객체 구조에 맞게 매핑
            setUser({
                id: initialUser.userId,
                email: initialUser.email,
                nickname: initialUser.nickname,
                profileImage: initialUser.profileImage,
            });
        } else {
            // ❗ 모든 필드가 null이면 로그인 안 된 상태로 간주
            setUser(null);
        }

        // 최신 사용자 정보 fetch 함수
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/user/me', {
                    method: 'GET',
                    credentials: 'include', // 중요 : 쿠키 포함
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.userId) {
                        setUser({
                            id: data.userId,
                            email: data.email,
                            nickname: data.nickname,
                            profileImage: data.profileImage,
                        });
                    } else {
                        setUser(null);
                    }
                } else if (res.status === 401) {
                    // 인증 만료 혹은 비로그인 상태
                    setUser(null);
                }
            } catch (error) {
                console.error('User fetch error : ', error);
                setUser(null);
            } finally {
                // 로딩 완료 표시
                setLoading(false);
            }
        };

        fetchUser();
    }, []);


    // 3️⃣ Context로 전달할 값 설정 (user, loading)
    const value = { user, loading, setUser };

    // 4️⃣ AuthContext.Provider로 하위 컴포넌트에 상태 공유
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5️⃣ useAuth 커스텀 훅: Context 접근을 위한 편의 함수
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
