import MovieList from "@features/recommend/MovieList.jsx";
import {useEffect, useState} from "react";
import RecommendText from "@features/recommend/RecommendText.jsx";
import { fetchRecommendedMovies} from "@api/recommendMovieApi.js";

function RecommendMoviePage(){

    const [emotionResult, setEmotionResult] = useState([]);
    const [moviesByPage, setMoviesByPage] = useState({});
    const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);

    useEffect(() => {
        fetchRecommendedMovies()
            .then((data) => {
                console.log("🎬 Api 응답 데이터:", data);
                console.log("🎬 감정 타입:", data.moods?.emotionType || "알 수 없음");

                setEmotionResult([
                    "종합추천",
                    data.moods?.[0]?.emotionType || "알 수 없음",
                    data.moods?.[1]?.emotionType || "알 수 없음",
                    data.moods?.[2]?.emotionType || "알 수 없음",
                ]);

                console.log("🎬 감정 타입:", data.moods?.emotionType || "알 수 없음");
                setMoviesByPage({
                    "종합추천": data.combinedResults,
                    [data.moods[0]?.emotionType]: data.resultsByEmotion[data.moods[0]?.emotionType] || [],
                    [data.moods[1]?.emotionType]: data.resultsByEmotion[data.moods[1]?.emotionType] || [],
                    [data.moods[2]?.emotionType]: data.resultsByEmotion[data.moods[2]?.emotionType] || [],
                });
            })
            .catch((error) => {
                console.error("❌ 영화 추천 API 호출 실패:", error);
                setMoviesByPage({});
                setEmotionResult([]);
            });
    }, []);

    if (emotionResult.length === 0) {
        return <div>감정 분석 결과를 불러오는 중입니다...</div>;
    }

    const currentEmotion = emotionResult[currentEmotionIndex] || "알 수 없음";

    const nextEmotion = () => {
        setCurrentEmotionIndex((prev) =>
            prev < emotionResult.length - 1 ? prev + 1 : 0
        );
    };

    return (
        <div>
            <RecommendText emotion={currentEmotion} />
            <MovieList movies={moviesByPage[currentEmotion]} emotion={currentEmotion} />
            <button className="next-emotion-btn" onClick={nextEmotion}>
                다음 감정 보기
            </button>
        </div>
    )
}

export default RecommendMoviePage;