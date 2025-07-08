/* =================================================================
 * 📂 File: src/shared/ui/Toast.jsx
 * 📌 역할: 사용자에게 간단한 알림(성공, 실패, 로딩 등)을 시각적으로 보여주는 Toast UI 컴포넌트
 * 🔧 사용 라이브러리: react-hot-toast
 *
 * ✅ 주요 기능:
 *   - App 전역에 토스트 메시지를 띄울 수 있도록 Toaster 컴포넌트 설정
 *   - 성공/실패/로딩 메시지를 쉽게 호출할 수 있는 showToast 헬퍼 제공
 *
 * 🧭 데이터 흐름:
 *   - [App 컴포넌트 등]에서 <AppToaster /> 렌더링 → 전역 Toast 영역 생성
 *   - [로직 코드]에서 showToast.success(), error(), loading() 호출 → 시각적 피드백 전달
 * ================================================================= */

import toast, { Toaster } from 'react-hot-toast';

// ✅ 1️⃣ 전역 토스트 영역 생성 컴포넌트
// 화면 최상단 중앙(top-center)에 토스트 메시지를 표시함
export const AppToaster = () => <Toaster position="top-center" reverseOrder={false} />;

// ✅ 2️⃣ 토스트 메시지 헬퍼 객체
// 상황별 메시지를 간단히 호출할 수 있도록 구성된 래퍼
export const showToast = {
    // 🎉 성공 메시지 표시: 초록색 배경 토스트
    success: (message, options) => toast.success(message, options),

    // ❌ 실패 메시지 표시: 빨간색 배경 토스트
    error: (message, options) => toast.error(message, options),

    // ⏳ 로딩 메시지 표시: 회전 아이콘과 함께 처리 중 표시
    loading: (message, options) => toast.loading(message, options),

    // 추가: promise 토스트 헬퍼
    // Promise 상태에 따라 자동으로 로딩/성공/실패 메시지를 표시
    promise: (promise, { loading, success, error }, options) =>
        toast.promise(promise, { loading, success, error }, options),
};
