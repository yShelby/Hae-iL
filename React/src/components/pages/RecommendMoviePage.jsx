import MovieList from "@features/recommend/MovieList.jsx";
import {useEffect, useState} from "react";
import RecommendText from "@features/recommend/RecommendText.jsx";
import { fetchRecommendedMovies} from "@api/recommendMovieApi.js";
import axios from "axios";

function RecommendMoviePage(){

    const [emotionResult, setEmotionResult] = useState([]);
    const [moviesByPage, setMoviesByPage] = useState({});
    const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
    const [shuffledMoviesByEmotion, setShuffledMoviesByEmotion] = useState({});

    // useEffect(() => {
    //     fetchRecommendedMovies()
    //         .then((data) => {
    //             console.log("🎬 Api 응답 데이터:", data);
    //             console.log("🎬 감정 타입:", data.moods?.emotionType || "알 수 없음");
    //
    //             setEmotionResult([
    //                 "종합추천",
    //                 data.moods?.[0]?.emotionType || "알 수 없음",
    //                 data.moods?.[1]?.emotionType || "알 수 없음",
    //                 data.moods?.[2]?.emotionType || "알 수 없음",
    //             ]);
    //
    //             console.log("🎬 감정 타입:", data.moods?.emotionType || "알 수 없음");
    //             setMoviesByPage({
    //                 "종합추천": data.combinedResults,
    //                 [data.moods[0]?.emotionType]: data.resultsByEmotion[data.moods[0]?.emotionType] || [],
    //                 [data.moods[1]?.emotionType]: data.resultsByEmotion[data.moods[1]?.emotionType] || [],
    //                 [data.moods[2]?.emotionType]: data.resultsByEmotion[data.moods[2]?.emotionType] || [],
    //             });
    //         })
    //         .catch((error) => {
    //             console.error("❌ 영화 추천 API 호출 실패:", error);
    //             setMoviesByPage({});
    //             setEmotionResult([]);
    //         });
    // }, []);

    useEffect(() => {
        const loadRecommendations = async () => {
            // 1. 로컬스토리지에서 이전 감정 결과 꺼내기
            const storedEmotionResult = localStorage.getItem("lastEmotionResult");
            const storedMoviesByPage = localStorage.getItem("cachedMoviesByPage");

            // 2. 만약 로컬 감정 결과가 있으면, API를 호출하지 말고 캐시 불러오기
            if (storedEmotionResult && storedMoviesByPage) {
                setEmotionResult(JSON.parse(storedEmotionResult));
                setMoviesByPage(JSON.parse(storedMoviesByPage));
                console.log("✅ 로컬 캐시에서 감정 및 영화 데이터 불러옴");
                return;
            }

            // 3. 로컬스토리지 없거나 감정이 바뀌었으면 API 호출
            try {
                const data = await fetchRecommendedMovies();  // await 추가

                const newEmotionResult = [
                    "종합추천",
                    data.moods?.[0]?.emotionType || "기타",
                    data.moods?.[1]?.emotionType || "기타",
                    data.moods?.[2]?.emotionType || "기타",
                ];

                setEmotionResult(newEmotionResult);
                const moviesByPageData = {
                    "종합추천": data.combinedResults,
                    [data.moods?.[0]?.emotionType]: data.resultsByEmotion[data.moods[0]?.emotionType] || [],
                    [data.moods?.[1]?.emotionType]: data.resultsByEmotion[data.moods[1]?.emotionType] || [],
                    [data.moods?.[2]?.emotionType]: data.resultsByEmotion[data.moods[2]?.emotionType] || [],
                };

                setEmotionResult(newEmotionResult);
                setMoviesByPage(moviesByPageData);

                localStorage.setItem("lastEmotionResult", JSON.stringify(newEmotionResult));
                localStorage.setItem("cachedMoviesByPage", JSON.stringify(moviesByPageData));
                console.log("🔄 감정이 바뀌어서 API 호출 후 데이터 저장 완료");
            } catch (error) {
                console.error("추천 영화 불러오기 실패:", error);
            }
        };
        loadRecommendations();
    }, []);

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

    if (emotionResult.length === 0) {
        return <div>감정 분석 결과를 불러오는 중입니다...</div>;
    }

    const currentEmotion = emotionResult[currentEmotionIndex] || "알 수 없음";

    const movies = shuffledMoviesByEmotion[currentEmotion] || [];

    const nextEmotion = () => {
        setCurrentEmotionIndex((prev) =>
            prev < emotionResult.length - 1 ? prev + 1 : 0
        );
    };

    return (
        <div>
            <RecommendText emotion={currentEmotion} />
            <MovieList movies={movies} emotion={currentEmotion} />
            <button className="next-emotion-btn" onClick={nextEmotion}>
                다음 감정 보기
            </button>
        </div>
    )
}

export default RecommendMoviePage;