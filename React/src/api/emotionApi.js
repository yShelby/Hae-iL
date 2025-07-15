// 📄 파일: src/api/emotionApi.js
import apiClient from "@api/apiClient.js";

/**
 * 📊 감정 분석 결과 조회 API
 * @param {number} diaryId - 감정분석 결과를 조회할 일기 ID
 * @returns {Promise} - Axios 응답 프로미스
 */
export const fetchEmotionByDiaryId = (diaryId) => {
    if (!diaryId) return Promise.reject(new Error("일기 ID가 필요합니다."));
    return apiClient.get(`/api/analyze/${diaryId}`);
};