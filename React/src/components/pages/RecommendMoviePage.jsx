import MovieList from "@features/recommend/MovieList.jsx";
import {useEffect, useState} from "react";
import RecommendText from "@features/recommend/RecommendText.jsx";
import { fetchRecommendedMovies} from "@api/recommendMovieApi.js";
import axios from "axios";
import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {useAuth} from "@features/auth/AuthContext.jsx";

function RecommendMoviePage(){
    const { user } = useAuth();  // 또는 useCheckLogin 내부에서도 이걸 씀
    const [emotionResult, setEmotionResult] = useState([]);
    const [moviesByPage, setMoviesByPage] = useState({});
    const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
    const [shuffledMoviesByEmotion, setShuffledMoviesByEmotion] = useState({});

    useEffect(() => {
        const storedEmotionResult = localStorage.getItem("lastEmotionResult");
        const storedMoviesByPage = localStorage.getItem("cachedMoviesByPage");

        if (storedEmotionResult && storedMoviesByPage) {
            setEmotionResult(JSON.parse(storedEmotionResult));
            setMoviesByPage(JSON.parse(storedMoviesByPage));
        }
    }, []);

    // useEffect(() => {
    //     const loadRecommendations = async () => {
    //         try {
    //             const data = await fetchRecommendedMovies();
    //
    //             console.log("data.noChange:", data.noChange);
    //
    //             if (data.noChange) {
    //                 // 감정 데이터 변경 없을 때 처리: 예를 들어 알림 보여주기
    //                 console.log("감정 데이터 변경 없음 - 추천 업데이트 안함");
    //                 // 로컬 캐시가 있으면 그걸 사용하거나 빈 리스트 처리
    //                 const storedEmotionResult = localStorage.getItem("lastEmotionResult");
    //                 const storedMoviesByPage = localStorage.getItem("cachedMoviesByPage");
    //
    //                 console.log("data.noChange:", data.noChange);
    //                 console.log("storedEmotionResult", storedEmotionResult);
    //                 console.log("storedMoviesByPage", storedMoviesByPage);
    //
    //
    //                 if (storedEmotionResult && storedMoviesByPage) {
    //                     setEmotionResult(JSON.parse(storedEmotionResult));
    //                     setMoviesByPage(JSON.parse(storedMoviesByPage));
    //                 } else {
    //                     setEmotionResult([]);
    //                     setMoviesByPage({});
    //                 }
    //                 return;
    //             }
    //
    //             // noChange가 false인 경우 기존 로직 진행
    //             const newEmotionResult = [
    //                 "종합추천",
    //                 data.moods?.[0]?.moodType || "기타",
    //                 data.moods?.[1]?.moodType || "기타",
    //                 data.moods?.[2]?.moodType || "기타",
    //             ];
    //
    //             setEmotionResult(newEmotionResult);
    //
    //             const moviesByPageData = {
    //                 "종합추천": data.combinedResults,
    //                 [data.moods?.[0]?.moodType]: data.resultsByEmotion[data.moods[0]?.moodType] || [],
    //                 [data.moods?.[1]?.moodType]: data.resultsByEmotion[data.moods[1]?.moodType] || [],
    //                 [data.moods?.[2]?.moodType]: data.resultsByEmotion[data.moods[2]?.moodType] || [],
    //             };
    //
    //             setMoviesByPage(moviesByPageData);
    //
    //             localStorage.setItem("lastEmotionResult", JSON.stringify(newEmotionResult));
    //             localStorage.setItem("cachedMoviesByPage", JSON.stringify(moviesByPageData));
    //             localStorage.setItem("cacheTimestamp", Date.now().toString());
    //
    //             console.log("🔄 API 호출 후 캐시 갱신");
    //
    //         } catch (error) {
    //             console.error("추천 영화 불러오기 실패:", error);
    //         }
    //     };
    //     loadRecommendations();
    // }, []);

    // useEffect(() => {
    //     const loadRecommendations = async () => {
    //         // 1. 로컬스토리지에서 이전 감정 결과 꺼내기
    //         const storedEmotionResult = localStorage.getItem("lastEmotionResult");
    //         const storedMoviesByPage = localStorage.getItem("cachedMoviesByPage");
    //
    //         // 2. 만약 로컬 감정 결과가 있으면, API를 호출하지 말고 캐시 불러오기
    //         if (storedEmotionResult && storedMoviesByPage) {
    //             setEmotionResult(JSON.parse(storedEmotionResult));
    //             setMoviesByPage(JSON.parse(storedMoviesByPage));
    //             console.log("✅ 로컬 캐시에서 감정 및 영화 데이터 불러옴");
    //             return;
    //         }
    //
    //         // 3. 로컬스토리지 없거나 감정이 바뀌었으면 API 호출
    //         try {
    //             const data = await fetchRecommendedMovies();  // await 추가
    //
    //             const newEmotionResult = [
    //                 "종합추천",
    //                 data.moods?.[0]?.emotionType || "기타",
    //                 data.moods?.[1]?.emotionType || "기타",
    //                 data.moods?.[2]?.emotionType || "기타",
    //             ];
    //
    //             setEmotionResult(newEmotionResult);
    //             const moviesByPageData = {
    //                 "종합추천": data.combinedResults,
    //                 [data.moods?.[0]?.emotionType]: data.resultsByEmotion[data.moods[0]?.emotionType] || [],
    //                 [data.moods?.[1]?.emotionType]: data.resultsByEmotion[data.moods[1]?.emotionType] || [],
    //                 [data.moods?.[2]?.emotionType]: data.resultsByEmotion[data.moods[2]?.emotionType] || [],
    //             };
    //
    //             setEmotionResult(newEmotionResult);
    //             setMoviesByPage(moviesByPageData);
    //
    //             localStorage.setItem("lastEmotionResult", JSON.stringify(newEmotionResult));
    //             localStorage.setItem("cachedMoviesByPage", JSON.stringify(moviesByPageData));
    //             console.log("🔄 감정이 바뀌어서 API 호출 후 데이터 저장 완료");
    //         } catch (error) {
    //             console.error("추천 영화 불러오기 실패:", error);
    //         }
    //     };
    //     loadRecommendations();
    // }, []);

    useEffect(() => {
        if (Object.keys(moviesByPage).length === 0) return;

        const newShuffled = {};
        for (const [emotion, movies] of Object.entries(moviesByPage)) {
            if (!Array.isArray(movies)) {
                console.warn(`Warning: moviesByPage[${emotion}] is not an array`, movies);
                continue;  // 또는 newShuffled[emotion] = [];
            }
            const copy = [...movies];
            for (let i = copy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [copy[i], copy[j]] = [copy[j], copy[i]];
            }
            newShuffled[emotion] = copy;
        }
        setShuffledMoviesByEmotion(newShuffled);
    }, [moviesByPage]);

    if (!user){
        return (
            <div>
                <div>로그인이 필요합니다.</div>
                <button className="next-emotion-btn" >
                    다음 감정 보기
                </button>
            </div>
        )
    }

    if (emotionResult.length === 0) {
        return <div>감정 분석 결과를 불러오는 중입니다...</div>;
    }

    const currentEmotion = emotionResult[currentEmotionIndex] || "알 수 없음";

    const movies = shuffledMoviesByEmotion[currentEmotion] || [];

    const handleDislike = (movieKey) => {
        setShuffledMoviesByEmotion(prev => {
            const newShuffled = { ...prev };
            if (!newShuffled[currentEmotion]) return prev;
            newShuffled[currentEmotion] = newShuffled[currentEmotion].filter(
                movie => movie.id !== movieKey
            );
            // 2) 로컬스토리지에 저장된 moviesByPage도 업데이트
            const storedMovies = JSON.parse(localStorage.getItem("cachedMoviesByPage") || "{}");
            for (const key of Object.keys(storedMovies)) {
                storedMovies[key] = storedMovies[key].filter(movie => movie.id !== movieKey);
            }

            localStorage.setItem("cachedMoviesByPage", JSON.stringify(storedMovies));

            return newShuffled;
        });
    };

    const nextEmotion = () => {
        setCurrentEmotionIndex((prev) =>
            prev < emotionResult.length - 1 ? prev + 1 : 0
        );
    };

    return (
        <div>
            <RecommendText emotion={currentEmotion} />
            <MovieList movies={movies} emotion={currentEmotion} onDisLike={handleDislike} />
            <button className="next-emotion-btn" onClick={nextEmotion}>
                다음 감정 보기
            </button>
        </div>
    )
}

export default RecommendMoviePage;