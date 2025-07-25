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

// export const dislikeMovie = async (movieKey) => {
//     try {
//         const response = await axios.post("/api/recommend/movies/dislike", null,{
//             params: { movieKey },
//             withCredentials: true,
//         });
//         console.log("movieKey : ", movieKey)
//         alert(response.data);
//     } catch (error) {
//         alert(error.response?.data || "에러발생");
//     }
// }

export const fetchDislikedMovies = async () => {
        const response = await axios.get("/api/recommend/movies/dislike", {
            withCredentials: true,
        });
        return response.data;
};

// export const fetchDislikedMovies = async () => {
//     try {
//         const response = await axios.get("/api/recommend/movies/dislike", {
//             withCredentials: true,
//         });
//         return response.data;
//     } catch (error) {
//         alert(error.response?.data || "조회 중 에러");
//         return [];
//     }
// };