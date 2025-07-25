import {fetchRecommendedMovies, refreshRecommendation} from '@/api/recommendMovieApi';

export const usePreloadRecommendation = () => {
    const preloadRecommendations = async (refresh = false) => {
        try {
            const response = refresh ? await refreshRecommendation() : await fetchRecommendedMovies()

            const moodType = (response.moods || []).map(m => m.moodType).filter(Boolean)
            const newEmotionResult = ["종합추천", ...moodType];

            const moviesByPageData = {"종합추천": response.combinedResults,};

            moodType.forEach(mood =>{
                moviesByPageData[mood] = response.resultByEmotion[mood] || []
            })

            localStorage.setItem("lastEmotionResult", JSON.stringify(newEmotionResult));
            localStorage.setItem("cachedMoviesByPage", JSON.stringify(moviesByPageData));
            localStorage.setItem("cacheTimestamp", Date.now().toString());

            console.log("✅ 일기 저장 후 추천 캐시 업데이트 완료");

            return {
                newEmotionResult,
                moviesByPageData,
            };
        } catch (error) {
            console.error("🎬 추천 캐싱 실패:", error);
            return null;
        }
    };

    return { preloadRecommendations };
};