import apiClient from "@api/apiClient.js";

/**
 * 오늘의 질문과 저장된 답변을 서버에서 가져오는 함수
 * @returns {Promise<Object>} { questionText: "...", answerText: "..." } 형태의 객체
 */
export const getTodayQuestionAndAnswer = async () => {
    try {
        const response = await apiClient.get('/api/question/today');
        return response.data;
    } catch (error) {
        if (error.response?.status !== 401) {
            console.error("오늘의 질문 조회 API 호출 실패:", error);
        }
        throw error;
    }
};

/**
 * 오늘의 질문에 대한 답변을 서버에 저장/수정하는 함수
 * @param {string} answerText - 사용자가 입력한 답변 내용
 * @returns {Promise<any>}
 */
export const saveAnswer = async (answerText) => {
    // answerText가 null이나 undefined일 경우를 대비하여 빈 문자열로 보낸다
    const textToSave = answerText || '';
    const response = await apiClient.post('/api/question/answer', { answerText: textToSave });
    return response.data;
};

/**
 * 오늘의 질문에 대한 답변을 서버에서 삭제하는 함수
 * @returns {Promise<any>}
 */
export const deleteAnswerAPI = async () => {
    try {
        const response = await apiClient.delete('/api/question/answer');
        return response.data;
    } catch (error) {
        console.error("답변 삭제 API 호출 실패:", error);
        throw error;
    }
};