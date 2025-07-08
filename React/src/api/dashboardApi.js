import axios from "axios";

const apiClient = axios.create({
    baseURL: "/api",
});

export const getDashboardStats = async () => {
    try {
        const response = await apiClient.get("/dashboard/stats");
        return response.data;
    } catch (e) {
        console.error("대시보드 통계 데이터 로딩에 실패했습니다: ", e);
        // 에러 발생 시, 화면이 깨지지 않도록 기본값을 반환합니다.
        return { totalDiaryCount: 0, journalingCount: 0, galleryImageCount: 0 };
    }
};