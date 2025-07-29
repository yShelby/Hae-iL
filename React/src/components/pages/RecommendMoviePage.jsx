import MovieList from "@features/recommend/MovieList.jsx";
import React, {useEffect, useState} from "react";
import RecommendText from "@features/recommend/RecommendText.jsx";
import {useAuth} from "@shared/context/AuthContext.jsx";
import {usePreloadRecommendation} from "@/hooks/usePreloadRecommed.js";
import {LoadingModal} from "@shared/UI/LoadingModal.jsx";
import '../shared/UI/css/LoadingModal.css'
import {RecommendTab} from "@features/recommend/RecommendTab.jsx";
import "./css/RecommendMoviePags.css"

function RecommendMoviePage(){
    const { user } = useAuth();  // 또는 useCheckLogin 내부에서도 이걸 씀
    const [emotionResult, setEmotionResult] = useState([]);
    const [moviesByPage, setMoviesByPage] = useState({});
    const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
    const [shuffledMoviesByEmotion, setShuffledMoviesByEmotion] = useState({});
    const [preLoading, setPreLoading] = useState(false); // 추천 콘텐츠 로딩 상태

    const {preloadRecommendations} = usePreloadRecommendation();

    useEffect(() => {
        const initializeData = async () => {
            setPreLoading(true); // 로딩 시작

            try {
                const data = await preloadRecommendations(false);  // await 필수

                if (data) {
                    setEmotionResult(data.newEmotionResult);
                    setMoviesByPage(data.moviesByPageData);
                } else {
                    // fallback: 로컬스토리지에서 읽기
                    const storedEmotionResult = localStorage.getItem("lastEmotionResult");
                    const storedMoviesByPage = localStorage.getItem("cachedMoviesByPage");
                    if (storedEmotionResult && storedMoviesByPage) {
                        setEmotionResult(JSON.parse(storedEmotionResult));
                        setMoviesByPage(JSON.parse(storedMoviesByPage));
                    }
                }
            } catch (err) {
                console.error("초기 추천 데이터 불러오기 실패", err);
            } finally {
                setPreLoading(false); // 로딩 종료
            }
        };

        initializeData();

    }, []);
    useEffect(() => {
        console.log("preLoading changed:", preLoading);
    }, [preLoading]);

    // const initializeData = () => {
    //     const storedEmotionResult = localStorage.getItem("lastEmotionResult");
    //     const storedMoviesByPage = localStorage.getItem("cachedMoviesByPage");
    //
    //     setPreLoading(true); // 로딩 상태 시작
    //     console.log("1",preLoading)
    //     try {
    //         preloadRecommendations?.(false).catch(console.error);
    //         if (storedEmotionResult && storedMoviesByPage) {
    //             setEmotionResult(JSON.parse(storedEmotionResult));
    //             setMoviesByPage(JSON.parse(storedMoviesByPage));
    //         }
    //     } catch (err){
    //         console.error("초기 추천 데이터 불러오기 실패", err)
    //     }
    //     console.log("2",preLoading)
    //     setPreLoading(false);
    //     console.log("3",preLoading)
    // }

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
            setPreLoading(true);
            try {
                await loadRecommendations().catch(console.error);
            } catch (e) {
                console.error(e)
            } finally {
                setPreLoading(false)
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


    if (emotionResult.length === 0) {
        return (
            <div>
                {preLoading && (<LoadingModal />
                )}
            </div>
        )
    }

    return (
        <div className={"movieParent"}>
            {preLoading && (<LoadingModal />
            )}
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

// import MovieList from "@features/recommend/MovieList.jsx";
// import React, {useEffect, useState} from "react";
// import RecommendText from "@features/recommend/RecommendText.jsx";
// import {useAuth} from "@shared/context/AuthContext.jsx";
// import {usePreloadRecommendation} from "@/hooks/usePreloadRecommed.js"; // 이 훅은 더 이상 초기 로딩에 사용되지 않지만, 다른 곳에서 사용될 수 있으므로 임포트 유지
// import {LoadingModal} from "@shared/UI/LoadingModal.jsx";
// import '../shared/UI/css/LoadingModal.css'
// import {RecommendTab} from "@features/recommend/RecommendTab.jsx";
// import "./css/RecommendMoviePags.css" // CSS Modules 사용 시 .module.css 확장자 확인 필요
//
// function RecommendMoviePage(){
//     const { user } = useAuth();
//     const [emotionResult, setEmotionResult] = useState([]);
//     const [moviesByPage, setMoviesByPage] = useState({});
//     const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
//     const [shuffledMoviesByEmotion, setShuffledMoviesByEmotion] = useState({});
//     const [preLoading, setPreLoading] = useState(false); // 추천 콘텐츠 로딩 상태 (이제 로컬 스토리지 로딩 완료 여부로 사용)
//
//     // usePreloadRecommendation 훅은 이제 초기 로딩에는 사용되지 않으므로 주석 처리하거나,
//     // 필요에 따라 loadRecommendations 함수만 사용하도록 변경할 수 있습니다.
//     // const {preloadRecommendations} = usePreloadRecommendation();
//
//
//     useEffect(() => {
//         const initializeData = async () => {
//             setPreLoading(true); // 로딩 시작 (로컬 스토리지 읽는 동안)
//
//             try {
//                 // 기존 API 호출 로직 주석 처리
//                 // const data = await preloadRecommendations(false); // await 필수
//
//                 // if (data) {
//                 //     setEmotionResult(data.newEmotionResult);
//                 //     setMoviesByPage(data.moviesByPageData);
//                 // } else {
//                 // 로컬스토리지에서만 읽기
//                 const storedEmotionResult = localStorage.getItem("lastEmotionResult");
//                 const storedMoviesByPage = localStorage.getItem("cachedMoviesByPage");
//
//                 if (storedEmotionResult && storedMoviesByPage) {
//                     console.log("✅ 로컬 스토리지에서 추천 데이터 로드 (API 호출 없음)");
//                     setEmotionResult(JSON.parse(storedEmotionResult));
//                     setMoviesByPage(JSON.parse(storedMoviesByPage));
//                 } else {
//                     console.warn("⚠️ 로컬 스토리지에 추천 데이터가 없습니다. UI가 비어있을 수 있습니다.");
//                     // 로컬 스토리지에 데이터가 없을 때의 초기 상태 처리 (예: 빈 배열 또는 메시지)
//                     setEmotionResult([]);
//                     setMoviesByPage({});
//                 }
//                 // }
//             } catch (err) {
//                 console.error("로컬 스토리지 데이터 로드 실패", err);
//                 setEmotionResult([]);
//                 setMoviesByPage({});
//             } finally {
//                 setPreLoading(false); // 로딩 종료
//             }
//         };
//
//         initializeData();
//
//     }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행
//
//     // preLoading 상태 변화 디버깅용 (필요 없으면 삭제해도 됨)
//     useEffect(() => {
//         console.log("preLoading changed:", preLoading);
//     }, [preLoading]);
//
//     // loadRecommendations 함수는 현재 사용되지 않으므로 주석 처리 (또는 삭제)
//     // 이 함수가 다시 활성화되면 usePreloadRecommendation 훅도 필요
//     // const loadRecommendations = async () => {
//     //     setPreLoading(true);
//     //     try {
//     //         const data = await preloadRecommendations(true);
//     //         setEmotionResult(data.newEmotionResult);
//     //         setMoviesByPage(data.moviesByPageData);
//     //         console.log("🔄 API 호출 후 캐시 갱신");
//     //     } catch (error) {
//     //         console.error("추천 영화 불러오기 실패:", error);
//     //     } finally {
//     //         setPreLoading(false);
//     //     }
//     // };
//
//     useEffect(() => {
//         if (Object.keys(moviesByPage).length === 0) {
//             setShuffledMoviesByEmotion({}); // 데이터가 없으면 셔플된 것도 없도록 초기화
//             return;
//         }
//
//         const newShuffled = {};
//         for (const [emotion, movies] of Object.entries(moviesByPage)) {
//             if (!Array.isArray(movies)) {
//                 console.warn(`Warning: moviesByPage[${emotion}] is not an array`, movies);
//                 newShuffled[emotion] = []; // 비어있는 경우 빈 배열로 처리
//                 continue;
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
//     // handleDislike 함수 내에서 loadRecommendations 호출 부분 주석 처리
//     const handleDislike = async (movieKey) => {
//         setShuffledMoviesByEmotion(prev => {
//             const newShuffled = { ...prev };
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
//         // 로컬 스토리지 모드에서는 영화 개수가 부족해도 API 호출을 하지 않습니다.
//         const updatedList = shuffledMoviesByEmotion[currentEmotion]?.filter(
//             movie => movie.id !== movieKey
//         );
//         if(updatedList && updatedList.length < 6){
//             setPreLoading(true);
//             try {
//                 await loadRecommendations().catch(console.error);
//             } catch (e) {
//                 console.error(e)
//             } finally {
//                 setPreLoading(false)
//             }
//         }
//     };
//
//     const nextEmotion = () => {
//         setCurrentEmotionIndex((prev) =>
//             prev < emotionResult.length - 1 ? prev + 1 : 0
//         );
//     };
//
//     // 로그인 확인 및 로딩 상태 처리
//     if (!user){
//         // 로딩 중이라면 로딩 모달을 보여주고, 아니라면 로그인 필요 메시지
//         return (
//             <div>
//                 {preLoading && <LoadingModal />}
//                 {!preLoading && (
//                     <>
//                         <div>로그인이 필요합니다.</div>
//                         <RecommendTab />
//                         <RecommendText emotion={currentEmotion} />
//                         <MovieList movies={movies} emotion={currentEmotion} onDisLike={handleDislike} />
//                         <button className="nextEmotionBtn" >
//                             다음 감정 보기
//                         </button>
//                     </>
//                 )}
//             </div>
//         )
//     }
//
//     // 로딩 중일 때만 로딩 모달을 표시
//     if (preLoading) {
//         return (
//             <div>
//                 <LoadingModal />
//             </div>
//         );
//     }
//
//     // 데이터가 없고 로딩도 끝났을 때
//     if (emotionResult.length === 0) {
//         return (
//             <div>
//                 <p>로컬 스토리지에 추천 데이터가 없습니다.</p>
//                 <p>개발자 도구 > Application > Local Storage를 확인하거나, </p>
//                 <p>API 호출 로직을 다시 활성화해야 합니다.</p>
//             </div>
//         )
//     }
//
//     // 정상 렌더링
//     return (
//         <div>
//             <RecommendTab />
//             {/* CSS Modules 사용 시 className={styles.moviePage} 로 수정 필요 */}
//             <div className={"moviePage"}>
//                 <RecommendText emotion={currentEmotion} />
//                 <MovieList movies={movies} emotion={currentEmotion} onDisLike={handleDislike} />
//                 {/* CSS Modules 사용 시 className={styles.nextEmotionBtn} 로 수정 필요 */}
//                 <button className="nextEmotionBtn" onClick={nextEmotion}>
//                     다음 감정 보기
//                 </button>
//             </div>
//         </div>
//     )
// }
//
// export default RecommendMoviePage;