// 📄 파일: src/api/emotionApi.js
import axios from 'axios';
// Flask 서버의 주소에 맞게 설정
const flaskClient = axios.create({
baseURL: 'http://localhost:5000',});
// Flask 서버 주소});

/**
 * 🧠 감정 분석 요청 API
 * @param {string} text - 분석할 텍스트
 * @returns {Promise}
 */

export const analyzeEmotionAPI = (text) => {
    return flaskClient.post('/analyze', { text });
};