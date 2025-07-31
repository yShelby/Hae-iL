import {preloadRecommendationCore} from "@features/recommend/preloadRecommeendationCore.js";

/**
 * 추천 영화 데이터를 백그라운드에서 안전하게 미리 받아와서 로컬스토리지에 캐시하는 유틸
 */
export function runPreloadInBackground(refresh = false) {
    // IIFE 패턴으로 비동기 작업 실행 (실행은 되지만 기다리지 않음)
    void (async () => {
        try {
            await preloadRecommendationCore(refresh);
            console.log('✅ [Background] 추천 API 성공적으로 호출됨');
        } catch (err) {
            console.error('❌ [Background] 추천 API 실패', err);
        }
    })();
}
