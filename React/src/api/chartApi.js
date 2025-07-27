import axios from 'axios';

const BASE_URL = '/api/charts';

/**
 * @param {{
 *   mode: "weekly" | "monthly",
 *   endDate: string              // e.g. "2025-07-27"
 * }} chartParams
 */

// post를 쓰는 이유
// : 개인정보가 포함된 data가 url에 노출되지 않도록 함
// : 그래프용 데이터 가공, 통계 산출, 집계 등은 대부분 POST를 사용
export async function fetchChartData(chartParams) {
    try {
        return await axios.post(BASE_URL, chartParams); // response 객체 전체를 리턴
    } catch (error) {
        console.error('차트 데이터 요청 실패:', error);
        throw error; // 에러를 다시 던져서 컴포넌트에서 처리할 수 있게
    }
}