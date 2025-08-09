import MovieList from "@features/recommend/MovieList.jsx";
import React, {useEffect, useRef, useState} from "react";
import RecommendText from "@features/recommend/RecommendText.jsx";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {usePreloadRecommendation} from "@/hooks/usePreloadRecommed.js";
import '../shared/UI/css/LoadingModal.css'
import {RecommendTab} from "@features/recommend/RecommendTab.jsx";
import "./css/RecommendMoviePags.css"

function RecommendMoviePage(){
    const { user } = useAuth();  // 또는 useCheckLogin 내부에서도 이걸 씀
    const [emotionResult, setEmotionResult] = useState([]);
    const [moviesByPage, setMoviesByPage] = useState({});
    const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
    const [shuffledMoviesByEmotion, setShuffledMoviesByEmotion] = useState({});
    const isPreloading = useRef(false);
    const [movies, setMovies] = useState([]);

    const {preloadRecommendations} = usePreloadRecommendation();

    useEffect(() => {
        const initializeData = async () => {

            try {
                const storedEmotionResult = localStorage.getItem("lastEmotionResult");
                const storedMoviesByPage = localStorage.getItem("cachedMoviesByPage");

                if (storedEmotionResult && storedMoviesByPage) {
                    console.log("✅ 로컬 스토리지에서 추천 데이터 로드 (API 호출 없음)");
                    setEmotionResult(JSON.parse(storedEmotionResult));
                    setMoviesByPage(JSON.parse(storedMoviesByPage));
                } else {
                    console.warn("⚠️ 로컬 스토리지에 추천 데이터가 없습니다. UI가 비어있을 수 있습니다.");
                    await preloadRecommendations(true);

                    // 호출 후 로컬스토리지에 저장된 값 다시 불러오기
                    const refreshedEmotionResult = localStorage.getItem("lastEmotionResult");
                    const refreshedMoviesByPage = localStorage.getItem("cachedMoviesByPage");
                    setEmotionResult([]);
                    setMoviesByPage({});
                    if (refreshedEmotionResult && refreshedMoviesByPage) {
                        setEmotionResult(JSON.parse(refreshedEmotionResult));
                        setMoviesByPage(JSON.parse(refreshedMoviesByPage));
                    } else {
                        console.warn("❌ API 호출 후에도 로컬스토리지가 비어있음");
                        setEmotionResult([]);
                        setMoviesByPage({});
                    }
                }
            } catch (err) {
                console.error("로컬 스토리지 데이터 로드 실패", err);
                setEmotionResult([]);
                setMoviesByPage({});
            }
        };
        initializeData();
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

    const currentEmotion = emotionResult[currentEmotionIndex] || "알 수 없음";

    // const movies = shuffledMoviesByEmotion[currentEmotion] || [];

    useEffect(() => {
        const current = emotionResult[currentEmotionIndex] || "알 수 없음";
        const newMovies = shuffledMoviesByEmotion[current] || [];
        setMovies(newMovies);
    }, [currentEmotionIndex, shuffledMoviesByEmotion, emotionResult]);

    const handleDislike = async (movieKey) => {
        setShuffledMoviesByEmotion(prev => {

            const newShuffled = { ...prev };

            if (!newShuffled[emotionResult[currentEmotionIndex]]) return prev;

            for (const emotion in newShuffled) {
                newShuffled[emotion] = newShuffled[emotion].filter(movie => movie.id !== movieKey);
            }

            // 2) 로컬스토리지에 저장된 moviesByPage도 업데이트
            const storedMovies = JSON.parse(localStorage.getItem("cachedMoviesByPage") || "{}");
            for (const key of Object.keys(storedMovies)) {
                storedMovies[key] = storedMovies[key].filter(movie => movie.id !== movieKey);
            }
            localStorage.setItem("cachedMoviesByPage", JSON.stringify(storedMovies));

            setMoviesByPage(storedMovies);

            return newShuffled;
        });

        const updatedList = shuffledMoviesByEmotion[currentEmotion]?.filter(
            movie => movie.id !== movieKey
        );

        if(updatedList && updatedList.length < 6){
            try {
                await preloadRecommendations(true);
            } catch (e) {
                console.error(e)
            }
        }
    };

    const nextEmotion = () => {
        setCurrentEmotionIndex((prev) =>
            prev < emotionResult.length - 1 ? prev + 1 : 0
        );
    };

    return (
        <div className={"moviePageContainer"}>
            {!user ? <div className={"movieLogout"}>로그인이 필요합니다.</div> : (
                <div className={"movieParent"}>
                    <RecommendTab />
                    <div className={"moviePage"}>
                        <RecommendText emotion={emotionResult[currentEmotionIndex] || "알 수 없음"} />
                        <MovieList movies={movies} emotion={currentEmotion} onDisLike={handleDislike} />
                        <button className="nextEmotionBtn" onClick={nextEmotion}>
                            다음 추천 보기
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RecommendMoviePage;