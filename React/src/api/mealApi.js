import axios from 'axios';

const BASE_URL = '/api/meal';

// 날짜별 식사 조회 (GET /api/meal?date=YYYY-MM-DD)
export async function fetchMealByDate(date) {
    const response = await axios.get(BASE_URL, { params: { date } });
    return response.data; // 식사 기록 객체 or null
}

// 식사 기록 생성 (POST /api/meal)
export async function addOrUpdateMeal(mealData) {
    // mealData 예: { date: '2025-07-06', breakfast: '계란', lunch: '샐러드', ... }
    const response = await axios.post(BASE_URL, mealData);
    return response.data;
}

// 식사 기록 수정 (PUT /api/meal/{mealId})
export async function updateMeal(mealId, mealData) {
    const response = await axios.put(`${BASE_URL}/${mealId}`, mealData);
    return response.data;
}

// 식사 기록 삭제 (DELETE /api/meal/{mealId})
export async function deleteMeal(mealId) {
    const response = await axios.delete(`${BASE_URL}/${mealId}`);
    return response.data; // 보통 없음 (204)
}

// 월별 기록된 날짜 목록 조회 (GET /api/meal/dates/{year}/{month})
export async function fetchActiveMealDates(year, month) {
    const response = await axios.get(`${BASE_URL}/dates/${year}/${month}`);
    return response.data; // LocalDate[] (YYYY-MM-DD 배열)
}
