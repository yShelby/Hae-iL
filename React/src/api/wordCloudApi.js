import apiClient from "@api/apiClient.js";

export const fetchWordCloudData = async () => {
    try {
        const response = await apiClient.get('/api/dashboard/wordcloud');
        return response.data;
    } catch (e) {
        // 401 에러는 무시하고 빈 배열 반환
        if (e.response) {
            if (e.response.status === 401) {
                // 로그인 안 했으면 그냥 빈 배열 반환
                return [];
            } else {
                console.error("워드클라우드 데이터 로딩에 실패했습니다: ", e);
                return [];
            }
        } else {
            // 네트워크 오류 등 기타 에러
            console.error("워드클라우드 데이터 로딩 중 알 수 없는 오류: ", e);
            return [];
        }
    }
};