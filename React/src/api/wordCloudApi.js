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

// [추가] 새로운 Test DB 연동을 위한 API 함수
// 백엔드에 새로 만든 '/api/test-emotions' 엔드포인트를 호출
export const fetchTestEmotionData = async () => {
    try {
        const response = await apiClient.get('/api/test-emotions');
        // 백엔드에서 받은 데이터의 'keyword' 필드를 프론트엔드가 사용하는 'text' 필드로 변경해준다.
        return response.data.map(item => ({
            text: item.keyword,
            value: item.value,
            sentiment: item.sentiment
        }));
    } catch (e) {
        console.error("테스트 감정 데이터 로딩에 실패했습니다: ", e);
        return []; // 오류 발생 시 빈 배열 반환
    }
};