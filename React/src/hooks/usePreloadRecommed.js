import {fetchRecommendedMovies, refreshRecommendation} from '@/api/recommendMovieApi';

export const usePreloadRecommendation = () => {
    const preloadRecommendations = async (refresh = false) => {
        try {
            const response = refresh ? await refreshRecommendation() : await fetchRecommendedMovies();

            const moodType = (response.moods || []).map(m => m.moodType).filter(Boolean);
            const newEmotionResult = ['종합추천', ...moodType];

            const moviesByPageData = { 종합추천: response.combinedResults };
            const resultByEmotion = response.resultsByEmotion || {};

            moodType.forEach(mood => {
                moviesByPageData[mood] = Array.isArray(resultByEmotion[mood]) ? resultByEmotion[mood] : [];
            });

            localStorage.setItem('lastEmotionResult', JSON.stringify(newEmotionResult));
            localStorage.setItem('cachedMoviesByPage', JSON.stringify(moviesByPageData));
            localStorage.setItem('cacheTimestamp', Date.now().toString());

            console.log("moviesByPageData : ", moviesByPageData)
            console.log("newEmotionResult : ", newEmotionResult)
            console.log('✅ 추천 캐시 저장 완료');
            console.log("📦 백엔드 응답 전체: ", response);
            console.log("📦 감정별 추천: ", response.resultsByEmotion);

            return { newEmotionResult, moviesByPageData };
        } catch (error) {
            console.error('❌ 추천 캐시 실패:', error);
            return null;
        }
    }
    return { preloadRecommendations };
};