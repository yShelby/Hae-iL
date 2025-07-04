import axios from 'axios';

/**
 * ⚙️ apiClient.js
 * ──────────────────────────────
 * ✅ 역할:
 * - Axios 인스턴스 생성하여 API 요청 기본 설정 담당
 * - 백엔드 기본 URL 세팅 및 JSON 헤더 지정
 * - 쿠키 기반 인증을 위해 withCredentials 활성화
 * - 응답 인터셉터로 401 Unauthorized 처리 (세션 만료 대응)
 *
 * 🔄 데이터 흐름도:
 * 1️⃣ import.meta.env.VITE_API_BASE_URL 에서 API 기본 URL 읽기
 * 2️⃣ axios.create()로 인스턴스 생성하며 기본 헤더 및 withCredentials 세팅
 * 3️⃣ 요청 후 응답을 받으면,
 * - 성공 시 그대로 응답 반환
 * - 실패 시 상태코드가 401이면 세션 만료로 판단해 사용자에게 알림 및 로그인 페이지 리다이렉트
 */

const apiClient = axios.create({
    // 🌍 API 기본 주소: .env 파일에서 설정된 값 사용
    baseURL: import.meta.env.VITE_API_BASE_URL,

    // 📡 요청 헤더: JSON 형식임을 명시
    headers: { 'Content-Type': 'application/json' },

    // 🍪 쿠키를 포함하여 인증 세션 유지 (백엔드와 통신 시 필수)
    withCredentials: true,
});

// 🎯 응답 인터셉터: 401 Unauthorized 에러 처리
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 에러(인증 실패)가 발생했을 때만 아래 로직 실행
        if (error.response && error.response.status === 401) {
            const currentPath = window.location.pathname;

            // Thymeleaf가 렌더링하는 실제 로그인 페이지의 경로는 '/' 이므로,
            // 현재 경로가 '/'가 아닐 경우에만 리다이렉트를 수행하여 무한 루프를 방지합니다.
            if (currentPath !== '/') {
                alert('세션이 만료되었거나 로그인이 필요합니다. 다시 로그인해주세요.');

                // 로그인 페이지로 이동시킵니다.
                // window.location.href는 페이지를 완전히 새로고침하며 이동합니다.
                window.location.href = '/';
            }
        }
        // 401 이외의 다른 에러는 그대로 반환하여, 각 컴포넌트에서 개별적으로 처리할 수 있도록 합니다.
        return Promise.reject(error);
    }
);

export default apiClient;
