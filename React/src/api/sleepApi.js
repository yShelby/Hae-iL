import axios from 'axios';

const BASE_URL = '/api/sleep';

// 날짜별 수면 조회 (GET /api/sleep?date=YYYY-MM-DD)
export async function fetchSleepByDate(date) {
    const response = await axios.get(BASE_URL, { params: { date } });
    return response.data; // SleepLogDto.Response or null
}

// 수면 기록 생성 (POST /api/sleep)
export async function addOrUpdateSleep(sleepData) {
    // sleepData 예: { date: '2025-07-06', totalSleepHours: 7.5, quality: 'Good' }
    const response = await axios.post(BASE_URL, sleepData);
    return response.data; // SleepLogDto.Response
}

// 수면 기록 수정 (PUT /api/sleep/{sleepId})
export async function updateSleep(sleepId, sleepData) {
    const response = await axios.put(`${BASE_URL}/${sleepId}`, sleepData);
    return response.data;
}

// 수면 기록 삭제 (DELETE /api/sleep/{sleepId})
export async function deleteSleep(sleepId) {
    const response = await axios.delete(`${BASE_URL}/${sleepId}`);
    return response.data; // 없음 (204)
}
