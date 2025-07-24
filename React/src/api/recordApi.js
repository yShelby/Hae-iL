import apiClient from "@api/apiClient.js";

/**
 * ✨ [핵심] 특정 연도와 월에 해당하는 기록(저널/일기) 날짜 데이터를 가져오는 API 함수
 * - 이 함수는 비동기(async) 함수이며, Promise를 반환합니다.
 *
 * @param {number} year - 조회할 연도 (e.g., 2025)
 * @param {number} month - 조회할 월 (e.g., 7)
 * @returns {Promise<object>} - 성공 시 { day: "type" } 형태의 객체 (e.g., { "15": "journal", "20": "both" }), 실패 시 빈 객체 {}
 */
export const getRecordDate = async (year, month) => {
    try {
        const response = await apiClient.get('/api/record/date', {
            params: { year, month },
        });

        // 성공적으로 응답을 받으면, 백엔드에서 보낸 실제 데이터(response.data)를 반환합니다.
        return response.data;

    } catch (error) {
        // 에러 핸들링
        // - 네트워크 오류나 서버 에러 등 API 호출 중 문제가 발생하면 이 블록이 실행된다.
        // - (참고: 401 인증 만료 에러는 apiClient의 인터셉터가 먼저 처리)
        console.error('기록 날짜 데이터를 가져오는 중 오류가 발생했습니다:', error);

        // 에러가 발생하더라도 앱 전체가 중단되지 않도록, 빈 객체를 반환
        // 이렇게 하면 이 함수를 호출한 컴포넌트에서 반환값이 undefined가 되어 발생하는 추가적인 오류를 방지 가능
        return {};
    }
};
