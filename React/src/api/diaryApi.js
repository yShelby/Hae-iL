import apiClient from "@api/apiClient.js";

/**
 * 📅 특정 날짜의 일기 데이터를 서버에서 조회하는 함수
 * @param {string} dateStr - 조회 대상 날짜 ('YYYY-MM-DD' 형식)
 * @returns {Promise} - Axios 응답 프로미스 반환
 */
export const fetchDiaryByDateAPI = (dateStr) => {
    // ❌ 날짜 문자열 없으면 에러 반환
    if (!dateStr) return Promise.reject(new Error('Date string is required'));

    // 🔍 GET 요청: 일기 조회
    return apiClient.get(`/api/diary?date=${dateStr}`);
};

/**
 * 📆 특정 월에 작성된 일기 날짜 목록을 서버에서 조회하는 함수
 * @param {Date} date - 조회 대상 월의 기준 날짜(Date 객체)
 * @returns {Promise} - Axios 응답 프로미스 반환
 */
export const fetchActiveDatesAPI = (date) => {
    // ❌ 날짜 객체 없으면 에러 반환
    if (!date) return Promise.reject(new Error('Date object is required'));

    // 📅 년도 및 월 추출 (월은 0부터 시작하므로 +1 처리)
    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    // 🔍 GET 요청: 해당 월 일기 작성일 목록 조회
    return apiClient.get(`/api/diary/dates/${year}/${month}`);
};

/**
 * 🆕 새 일기를 서버에 저장하는 함수
 * @param {object} dto - 저장할 일기 데이터 객체
 * @returns {Promise} - Axios 응답 프로미스 반환
 */
export const saveDiaryAPI = (dto) => {
    // ➕ POST 요청: 새 일기 저장
    return apiClient.post('/api/diary', dto);
};

/**
 * ✏️ 기존 일기를 수정하는 함수
 * @param {number} diaryId - 수정할 일기의 고유 ID
 * @param {object} dto - 수정할 일기 데이터 객체
 * @returns {Promise} - Axios 응답 프로미스 반환
 */
export const updateDiaryAPI = (diaryId, dto) => {
    // 🔄 PUT 요청: 특정 일기 수정
    return apiClient.put(`/api/diary/${diaryId}`, dto);
};

/**
 * 🗑️ 특정 일기를 삭제하는 함수
 * @param {number} diaryId - 삭제할 일기의 고유 ID
 * @returns {Promise} - Axios 응답 프로미스 반환
 */
export const deleteDiaryAPI = (diaryId) => {
    if (!diaryId) return Promise.reject(new Error('Diary ID is required'));
    // ❌ DELETE 요청: 특정 일기 삭제
    return apiClient.delete(`/api/diary/${diaryId}`);
};

/**
 *
 * 📊 데이터 흐름 설명:
 * 1️⃣ 클라이언트에서 날짜(문자열 혹은 Date 객체) 입력 → 해당 날짜 혹은 월의 일기 데이터 요청(fetchDiaryByDateAPI, fetchActiveDatesAPI)
 * 2️⃣ 새 일기 작성 시 saveDiaryAPI를 통해 서버에 데이터 전송
 * 3️⃣ 기존 일기 수정 시 updateDiaryAPI를 사용해 해당 일기 ID로 수정 요청
 * 4️⃣ 일기 삭제 시 deleteDiaryAPI를 사용해 해당 일기 ID 삭제 요청
 * 5️⃣ 모든 API 호출은 axios 인스턴스(apiClient)를 통해 처리되며, 요청 헤더와 토큰 관리가 일괄적으로 적용됨
 *
 */

export const fetchDiaryByIdAPI = (diaryId) => {
    return apiClient.get(`/api/diary/${diaryId}`);
};