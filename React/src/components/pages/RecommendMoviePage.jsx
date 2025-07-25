import MovieList from "@features/recommend/MovieList.jsx";
import {useEffect, useState} from "react";
import RecommendText from "@features/recommend/RecommendText.jsx";
import {refreshRecommendation} from "@api/recommendMovieApi.js";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {usePreloadRecommendation} from "@/hooks/usePreloadRecommed.js";

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

    const {preloadRecommendations} = usePreloadRecommendation();

    const loadRecommendations = async () => {
            try {
                const data = await preloadRecommendations(true);

                setEmotionResult(data.newEmotionResult);

                setMoviesByPage(data.moviesByPageData);

                console.log("🔄 API 호출 후 캐시 갱신");

            } catch (error) {
                console.error("추천 영화 불러오기 실패:", error);
            }
        };

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

            const updateList = newShuffled[currentEmotion].filter(
                movie => movie.id !== movieKey
            );

            newShuffled[currentEmotion] = updateList;

            // 2) 로컬스토리지에 저장된 moviesByPage도 업데이트
            const storedMovies = JSON.parse(localStorage.getItem("cachedMoviesByPage") || "{}");
            for (const key of Object.keys(storedMovies)) {
                storedMovies[key] = storedMovies[key].filter(movie => movie.id !== movieKey);
            }

            localStorage.setItem("cachedMoviesByPage", JSON.stringify(storedMovies));

            if(updateList.length < 6){
            loadRecommendations().catch(console.error);
            }

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