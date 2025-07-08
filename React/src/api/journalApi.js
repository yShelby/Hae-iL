import apiClient from "@/api/apiClient.js";

// 카테고리별로 저널 목록을 가져오는 함수
export const getJournals = async (category) => {
    try {
        // GET /api/journal?category=카테고리 요청
        const response = await apiClient.get('/api/journal', {
            params: { category },
        });

        // API 응답이 배열인지 확인하고 아니면 빈 배열 반환해 UI 오류 방지
        if (!Array.isArray(response.data)) {
            console.warn("API 응답이 배열이 아닙니다:", response.data);
            return [];
        }

        return response.data;
    } catch (error) {
        console.error("저널 데이터를 불러오는 중 오류가 발생했습니다.", error);

        // 401 Unauthorized 발생 시 로그인 페이지로 리다이렉트 처리
        if (error.response?.status === 401) {
            window.location.href = '/login';  // 필요에 따라 로그인 경로 조정 가능
            return [];
        }

        // 그 외 에러는 빈 배열 반환해 UI 방어
        return [];
    }
};

// 새 저널을 생성하는 POST 요청 함수
export const createJournal = async (journalData) => {
    try {
        const response = await apiClient.post('/api/journal', journalData);
        return response;
    } catch (error) {
        // 에러 메시지를 안전하게 추출 후 콘솔에 출력하고 예외 던짐
        const errorData = error.response?.data || error.message || "알 수 없는 오류";
        console.error("저널 생성 중 오류가 발생했습니다.", errorData);
        throw errorData;
    }
};

// 특정 ID의 저널 상세 정보를 가져오는 GET 요청 함수
export const getJournalById = async (journalId) => {
    const response = await apiClient.get(`/api/journal/${journalId}`);
    return response.data;
};

// 특정 ID 저널을 수정하는 PUT 요청 함수
export const updateJournal = async (journalId, journalData) => {
    const response = await apiClient.put(`/api/journal/${journalId}`, journalData);
    return response;
};

// 특정 ID 저널을 삭제하는 DELETE 요청 함수
export const deleteJournal = async (journalId) => {
    const response = await apiClient.delete(`/api/journal/${journalId}`);
    return response;
};
