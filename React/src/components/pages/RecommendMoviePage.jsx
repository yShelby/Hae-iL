// import MovieList from "@features/recommend/MovieList.jsx";
// import React, {useEffect, useState} from "react";
// import RecommendText from "@features/recommend/RecommendText.jsx";
// import {useAuth} from "@shared/context/AuthContext.jsx";
// import {usePreloadRecommendation} from "@/hooks/usePreloadRecommed.js";
// import {LoadingModal} from "@shared/UI/LoadingModal.jsx";
// import '../shared/UI/css/LoadingModal.css'
// import {RecommendTab} from "@features/recommend/RecommendTab.jsx";
// import "./css/RecommendMoviePags.css"
// import {runPreloadInBackground} from "@features/recommend/runPreloadInBackground.js";
//
// function RecommendMoviePage(){
//     const { user } = useAuth();  // 또는 useCheckLogin 내부에서도 이걸 씀
//     const [emotionResult, setEmotionResult] = useState([]);
//     const [moviesByPage, setMoviesByPage] = useState({});
//     const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
//     const [shuffledMoviesByEmotion, setShuffledMoviesByEmotion] = useState({});
//     // const [preLoading, setPreLoading] = useState(false); // 추천 콘텐츠 로딩 상태
//
//     const {preloadRecommendations} = usePreloadRecommendation();
//     // const { data: preloadedData} = usePreloadRecommendation();
//
//     useEffect(() => {
//         const initializeData = async () => {
//
//             try {
//                 const storedEmotionResult = localStorage.getItem("lastEmotionResult");
//                 const storedMoviesByPage = localStorage.getItem("cachedMoviesByPage");
//
//                 if (storedEmotionResult && storedMoviesByPage) {
//                     console.log("✅ 로컬 스토리지에서 추천 데이터 로드 (API 호출 없음)");
//                     setEmotionResult(JSON.parse(storedEmotionResult));
//                     setMoviesByPage(JSON.parse(storedMoviesByPage));
//                 } else {
//                     console.warn("⚠️ 로컬 스토리지에 추천 데이터가 없습니다. UI가 비어있을 수 있습니다.");
//                     setEmotionResult([]);
//                     setMoviesByPage({});
//                 }
//             } catch (err) {
//                 console.error("로컬 스토리지 데이터 로드 실패", err);
//                 setEmotionResult([]);
//                 setMoviesByPage({});
//             }
//         };
//         initializeData();
//     }, []);
//
//     // useEffect(() => {
//     //     console.log("preLoading changed:", preLoading);
//     // }, [preLoading]);
//
//     // const initializeData = () => {
//     //     const storedEmotionResult = localStorage.getItem("lastEmotionResult");
//     //     const storedMoviesByPage = localStorage.getItem("cachedMoviesByPage");
//     //
//     //     setPreLoading(true); // 로딩 상태 시작
//     //     console.log("1",preLoading)
//     //     try {
//     //         preloadRecommendations?.(false).catch(console.error);
//     //         if (storedEmotionResult && storedMoviesByPage) {
//     //             setEmotionResult(JSON.parse(storedEmotionResult));
//     //             setMoviesByPage(JSON.parse(storedMoviesByPage));
//     //         }
//     //     } catch (err){
//     //         console.error("초기 추천 데이터 불러오기 실패", err)
//     //     }
//     //     console.log("2",preLoading)
//     //     setPreLoading(false);
//     //     console.log("3",preLoading)
//     // }
//
//     const loadRecommendations = async () => {
//         try {
//
//             runPreloadInBackground(true);
//             console.log("🔄 API 호출 후 캐시 갱신");
//
//         } catch (error) {
//             console.error("추천 영화 불러오기 실패:", error);
//         }
//     };
//
//     useEffect(() => {
//         if (Object.keys(moviesByPage).length === 0) return;
//
//         const newShuffled = {};
//         for (const [emotion, movies] of Object.entries(moviesByPage)) {
//             if (!Array.isArray(movies)) {
//                 console.warn(`Warning: moviesByPage[${emotion}] is not an array`, movies);
//                 continue;  // 또는 newShuffled[emotion] = [];
//             }
//             const copy = [...movies];
//             for (let i = copy.length - 1; i > 0; i--) {
//                 const j = Math.floor(Math.random() * (i + 1));
//                 [copy[i], copy[j]] = [copy[j], copy[i]];
//             }
//             newShuffled[emotion] = copy;
//         }
//         setShuffledMoviesByEmotion(newShuffled);
//     }, [moviesByPage]);
//
//     const currentEmotion = emotionResult[currentEmotionIndex] || "알 수 없음";
//
//     const movies = shuffledMoviesByEmotion[currentEmotion] || [];
//
//     const handleDislike = async (movieKey) => {
//         setShuffledMoviesByEmotion(prev => {
//
//             const newShuffled = { ...prev };
//
//             if (!newShuffled[currentEmotion]) return prev;
//
//             newShuffled[currentEmotion] = newShuffled[currentEmotion].filter(
//                 movie => movie.id !== movieKey
//             );
//
//             // 2) 로컬스토리지에 저장된 moviesByPage도 업데이트
//             const storedMovies = JSON.parse(localStorage.getItem("cachedMoviesByPage") || "{}");
//             for (const key of Object.keys(storedMovies)) {
//                 storedMovies[key] = storedMovies[key].filter(movie => movie.id !== movieKey);
//             }
//             localStorage.setItem("cachedMoviesByPage", JSON.stringify(storedMovies));
//
//             return newShuffled;
//         });
//
//         const updatedList = shuffledMoviesByEmotion[currentEmotion]?.filter(
//             movie => movie.id !== movieKey
//         );
//
//         if(updatedList && updatedList.length < 6){
//             // setPreLoading(true);
//             try {
//                 await preloadRecommendations(true);
//             } catch (e) {
//                 console.error(e)
//             }
//             // finally {
//             //     setPreLoading(false)
//             // }
//         }
//     };
//
//
//
//     const nextEmotion = () => {
//         setCurrentEmotionIndex((prev) =>
//             prev < emotionResult.length - 1 ? prev + 1 : 0
//         );
//     };
//
//     if (!user){
//         return (
//                 <div className={"movieLogout"}>로그인이 필요합니다.</div>
//         )
//     }
//
//
//     // if (emotionResult.length === 0) {
//     //     return (
//     //         <div>
//     //             {preLoading && (<LoadingModal />
//     //             )}
//     //         </div>
//     //     )
//     // }
//     //
//     return (
//         <div className={"movieParent"}>
//             {/*{preLoading && (<LoadingModal />*/}
//             {/*)}*/}
//             <RecommendTab />
//             <div className={"moviePage"}>
//                 <RecommendText emotion={currentEmotion} />
//                 <MovieList movies={movies} emotion={currentEmotion} onDisLike={handleDislike} />
//                 <button className="nextEmotionBtn" onClick={nextEmotion}>
//                     다음 추천 보기
//                 </button>
//             </div>
//         </div>
//     )
// }
//
// export default RecommendMoviePage;

import MovieList from "@features/recommend/MovieList.jsx";
import React, {useEffect, useState} from "react";
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
                    setEmotionResult([]);
                    setMoviesByPage({});
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

    const movies = shuffledMoviesByEmotion[currentEmotion] || [];

    const handleDislike = async (movieKey) => {
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

    if (!user){
        return (
            <div className={"movieLogout"}>로그인이 필요합니다.</div>
        )
    }

    return (
        <div className={"movieParent"}>
            {/*{preLoading && (<LoadingModal />*/}
            {/*)}*/}
            <RecommendTab />
            <div className={"moviePage"}>
                <RecommendText emotion={currentEmotion} />
                <MovieList movies={movies} emotion={currentEmotion} onDisLike={handleDislike} />
                <button className="nextEmotionBtn" onClick={nextEmotion}>
                    다음 추천 보기
                </button>
            </div>
        </div>
    )
}

export default RecommendMoviePage;