import apiClient from "@api/apiClient.js";

/**
 * [GET] 오늘의 포춘쿠키 상태(열 수 있는지 여부 등)를 서버에서 가져온다
 * @returns {Promise<object>} 포춘쿠키 상태 데이터
 */
export const getFortuneStatus = () => {
    return apiClient.get('/api/dashboard/fortune');
};

/**
 * [POST] 포춘쿠키를 열어달라고 서버에 요청
 * @returns {Promise<object>} 새로 뽑은 운세 메시지 데이터
 */
export const openFortune = () => {
    return apiClient.post('/api/dashboard/fortune');
};
