import { fetchRecommendedMovies } from '@/api/recommendMovieApi';

export const usePreloadRecommendation = () => {
    const preloadRecommendations = async () => {
        try {
            const response = await fetchRecommendedMovies();

            const newEmotionResult = [
                "종합추천",
                response.moods?.[0]?.moodType || "기타",
                response.moods?.[1]?.moodType || "기타",
                response.moods?.[2]?.moodType || "기타",
            ];

            const moviesByPageData = {
                "종합추천": response.combinedResults,
                [response.moods?.[0]?.moodType]: response.resultsByEmotion[response.moods[0]?.moodType] || [],
                [response.moods?.[1]?.moodType]: response.resultsByEmotion[response.moods[1]?.moodType] || [],
                [response.moods?.[2]?.moodType]: response.resultsByEmotion[response.moods[2]?.moodType] || [],
            };

            localStorage.setItem("lastEmotionResult", JSON.stringify(newEmotionResult));
            localStorage.setItem("cachedMoviesByPage", JSON.stringify(moviesByPageData));
            localStorage.setItem("cacheTimestamp", Date.now().toString());

            console.log("✅ 일기 저장 후 추천 캐시 업데이트 완료");
        } catch (error) {
            console.error("🎬 추천 캐싱 실패:", error);
        }
    };

    return { preloadRecommendations };
};