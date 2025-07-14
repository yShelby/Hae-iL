import apiClient from "@api/apiClient.js";

/**
 * 오늘의 질문을 랜덤으로 가져오는 함수
 * @returns {Promise<Object>} { questionText: "..." } 형태의 객체
 */
export const getTodayQuestionAPI = async () => {
    try {
        // API 엔드포인트는 기존과 동일하게 /api/question/today를 사용
        const response = await apiClient.get('/api/question/today');
        return response.data;
    } catch (error) {
        // 401(미인증) 에러는 apiClient 인터셉터에서 공통 처리하므로, 그 외의 에러만 로그를 남긴다
        if (error.response?.status !== 401) {
            console.error("오늘의 질문 조회 API 호출 실패:", error);
        }
        // 에러를 다시 throw하여 호출한 컴포넌트(e.g., TodayQuestion.jsx)에서 catch 가능.
        throw error;
    }
};