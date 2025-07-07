import apiClient from "@api/apiClient.js";

export const getJournals = async (category) => {
    try {
        const response = await apiClient.get('/journal', {
            params: {category}
        });
        return response.data;
    } catch (error) {
        console.error("저널 데이터를 불러오는 중 오류가 발생했습니다.", error);
        // 401(Unauthorized) 에러 발생 시, 로그인 페이지로 리디렉션하는 등의 후속 처리를 할 수 있습니다.
        throw error;
    }
};

export const createJournal = async (journalData) => {
    try {
        const response = await apiClient.post('/journal', journalData);
        return response;
    } catch (error) {
        console.error("저널 생성 중 오류가 발생했습니다.", error.response.data);
        throw error.response.data;
    }
}