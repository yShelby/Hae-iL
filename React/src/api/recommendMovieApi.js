import axios from "axios";

// 감정 기반 영화 추천 API 호출 함수
export const fetchRecommendedMovies = async () => {
    const response = await axios.get("/api/recommend/movies", {
        withCredentials: true,
    });
    return response.data;
};

export const refreshRecommendation = async () => {
    const response = await axios.get("/api/recommend/movies/refresh", {
        withCredentials: true,
    });
    return response.data;
};

export const dislikeMovie = async (movieKey) => {

        const response = await axios.post(`/api/recommend/movies/dislike?movieKey=${movieKey}`, null,{
            withCredentials: true,
        });
        return response.data;
}