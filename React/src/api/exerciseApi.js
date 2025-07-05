import axios from 'axios';

const BASE_URL = '/api/exercise';

// 날짜별 운동 기록 조회 (GET /api/exercise?date=YYYY-MM-DD)
export async function fetchExerciseByDate(date) {
    const response = await axios.get(BASE_URL, { params: { date } });
    return response.data; // 운동 기록 객체 or null
}

// 운동 기록 생성 (POST /api/exercise)
export async function addOrUpdateExercise(exerciseData) {
    // exerciseData 예: { date: '2025-07-06', type: '달리기', duration: 30 }
    const response = await axios.post(BASE_URL, exerciseData);
    return response.data;
}

// 운동 기록 수정 (PUT /api/exercise/{exerciseId})
export async function updateExercise(exerciseId, exerciseData) {
    const response = await axios.put(`${BASE_URL}/${exerciseId}`, exerciseData);
    return response.data;
}

// 운동 기록 삭제 (DELETE /api/exercise/{exerciseId})
export async function deleteExercise(exerciseId) {
    const response = await axios.delete(`${BASE_URL}/${exerciseId}`);
    return response.data; // 보통 없음 (204)
}

// 월별 기록된 날짜 목록 조회 (GET /api/exercise/dates/{year}/{month})
export async function fetchActiveExerciseDates(year, month) {
    const response = await axios.get(`${BASE_URL}/dates/${year}/${month}`);
    return response.data; // LocalDate[] (YYYY-MM-DD 배열)
}
