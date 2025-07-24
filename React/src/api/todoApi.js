import apiClient from "@api/apiClient.js";

export const getTodayTodoStatus = async () => {
    try {
        const response = await apiClient.get('/api/todolist/today');
        return response.data;
    } catch (error) {
        // 401 에러는 apiClient의 인터셉터가 처리하므로, 여기서는 그 외의 에러만 콘솔에 기록
        if (error.response?.status !== 401) {
            console.error("오늘의 미션 상태 조회 API 호출 실패:", error);
        }
        // 컴포넌트에서 에러를 인지하고 로딩 상태를 false로 바꿀 수 있도록 에러를 다시 던져주는 것이 좋다
        throw error;
    }
};