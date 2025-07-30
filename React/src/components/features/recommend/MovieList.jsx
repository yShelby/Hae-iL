// import React, {useState} from "react";
// import './css/MovieList.css'
// import {IconCarambola, IconCarambolaFilled, IconSquare, IconSquareCheck} from "@tabler/icons-react";
// import {dislikeMovie} from "@api/recommendMovieApi.js";
//
// function MovieList({ movies, onDisLike}) {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [trailerUrl, setTrailerUrl] = useState("");
//     const [selectedMovie, setSelectedMovie] = useState(null)
//     const [openDislikeModalMovieId, setOpenDislikeModalMovieId] = useState(null);
//
//     const [dislikedForMonthStatus, setDislikedForMonthStatus] = useState({});
//
//     const closeModal = () => {
//         setIsModalOpen(false);
//         setTrailerUrl("");
//     };
//
//     const handleToggleDislikeForMonth = async (e, movieId) => {
//         e.stopPropagation(); // 카드 클릭 이벤트 방지
//
//         // 현재 상태를 반전시켜 onDisLike 함수에 전달
//         // true: 한 달 동안 비추천, false: 비추천 해제
//         const newStatus = !dislikedForMonthStatus[movieId];
//
//         // onDisLike 함수는 영화를 목록에서 제거하는 역할을 하므로,
//         // 이 아이콘 클릭은 "한 달 동안 추천하지 않기" 즉, "비추천"과 동일하게 처리합니다.
//         // onDisLike 함수가 성공적으로 실행되면, 해당 영화는 리스트에서 사라질 것입니다.
//         try {
//             // onDisLike 함수에 movieKey만 전달하거나, 추가적인 상태 정보를 전달할 수 있습니다.
//             // 예: onDisLike(movieId, newStatus);
//             await dislikeMovie(movieId)
//             onDisLike(movieId); // 영화를 리스트에서 제거 (RecommendMoviePage에서 처리)
//
//             // onDisLike가 성공적으로 호출되면 해당 영화는 목록에서 사라질 것이므로,
//             // 여기서 dislikedForMonthStatus를 직접 업데이트할 필요는 없을 수 있습니다.
//             // 하지만 만약 영화가 목록에서 사라지지 않고 단순히 "한 달 동안 추천하지 않기" 상태만 변경된다면,
//             // 아래 setDislikedForMonthStatus 로직이 필요합니다.
//             setDislikedForMonthStatus(prev => ({
//                 ...prev,
//                 [movieId]: newStatus // 상태 업데이트
//             }));
//             console.log(`Movie ${movieId} disliked for month: ${newStatus}`);
//         } catch (error) {
//             console.error("비추천 처리 실패:", error);
//             // 에러 발생 시 상태 롤백 또는 사용자에게 알림
//         }
//     };
//
//     const renderStars = (voteAverage) => {
//         const starsRating = Math.round(voteAverage / 2);
//
//         const starsElements = [];
//         for (let i = 1; i <= 5; i++) {
//             if (i <= starsRating){
//                 starsElements.push(
//                     <IconCarambolaFilled
//                         key={i}
//                         size={10} // 명세된 크기
//                         color="var(--primary-color)" // 활성 상태 색상을 테마 메인 색상으로 가정
//                         className={"starIcon"}
//                     />
//                 );
//             }else{
//                 starsElements.push(
//                     <IconCarambola
//                         key={i}
//                         size={10}
//                         color="var(--primary-color)"
//                         className={"starIcon"}
//                     />
//                 );
//             }
//         }
//         return starsElements;
//     }
//
//     return (
//             <div className="movieList">
//                 {movies.slice(0, 6).map((movie) => (
//                     <div
//                         key={movie.id}
//                         className="movieCard"
//                         onClick={() => {
//                             setSelectedMovie(movie)
//                             if (movie.trailerUrl) {
//                                 setTrailerUrl(movie.trailerUrl);
//                             } else {
//                                 // 트레일러 없으면 모달 안 열림 or 알림 띄우기
//                                 setTrailerUrl("")
//                             }
//                             setIsModalOpen(true);
//                         }}
//                     >
//                         <img
//                             src={
//                                 movie.poster_path
//                                     ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
//                                     : "/no-image.png"
//                             }
//                             alt={movie.title}
//                             className="moviePoster"
//                         />
//                         <div className="movieInfo">
//                             <p className="movieTitle">{movie.title}</p>
//                             <p className={"movieVote"}>
//                                 {renderStars(movie.vote_average)}</p>
//                             <p className="movieOverview">{movie.overview || "줄거리 정보 없음"}</p>
//                             {/*<button*/}
//                             {/*    className="moviePlus"*/}
//                             {/*    onClick={(e) => {*/}
//                             {/*        e.stopPropagation(); // 카드 클릭 이벤트 방지*/}
//                             {/*        onDisLike(movie.id);*/}
//                             {/*    }}*/}
//                             {/*>한 달동안 추천하지 않기</button>*/}
//
//                             {/* '한 달 동안 추천하지 않기' 아이콘 컴포넌트 */}
//                             <div
//                                 className={"dislikeForMonthContainer"}
//                                 onClick={(e) => handleToggleDislikeForMonth(e, movie.id)} // 클릭 시 바로 처리
//                             >
//                                 {dislikedForMonthStatus[movie.id] ? (
//                                     <IconSquareCheck
//                                         size={8}
//                                         color="var(--primary-color)"
//                                         className={"dislikeIcon"}
//                                     />
//                                 ) : (
//                                     <IconSquare
//                                         size={8}
//                                         color="var(--theme1-main-color)"
//                                         className={"dislikeIcon"}
//                                     />
//                                 )}
//                                 <span className={"dislikeText"}> 한 달 동안 추천하지 않기</span>
//                             </div>
//                             {/* DisLikeModal과 관련된 JSX는 제거 */}
//
//                             {/*{openDislikeModalMovieId === movie.id && (*/}
//                             {/*    <DisLikeModal movieKey={movie.id} onClose={() => setOpenDislikeModalMovieId(null)} onDisLike={onDisLike} />*/}
//                             {/*)}*/}
//                         </div>
//                     </div>
//                 ))}
//
//                 {isModalOpen && selectedMovie && (
//                     <div className="modal-backdrop" onClick={closeModal}>
//                         <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//                             {trailerUrl ? (
//                                 <iframe
//                                     width="100%"
//                                     height="400"
//                                     src={trailerUrl}
//                                     title="Movie Trailer"
//                                     frameBorder="0"
//                                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                     allowFullScreen
//                                 />
//                             ) : (
//                                 <div className="overview-fallback">
//                                     <h2 className={"modal-title"}>{selectedMovie.title}</h2>
//                                     <h3 className={"modal-director"}>감독 : {selectedMovie.directorName}</h3>
//                                     <h3 className={"modal-cast"}>출연진 : {selectedMovie.castNames.join(', ')}</h3>
//                                     <p className={"modal-overview"}>{selectedMovie.overview || "줄거리 정보가 없습니다."}</p>
//                                 </div>
//                             )}
//
//
//                         </div>
//                     </div>
//                 )
//                 }
//             </div>
//     )
// }
// export default MovieList;

import React, {useState} from "react";
import './css/MovieList.css'
import {IconCarambola, IconCarambolaFilled, IconSquare, IconSquareCheck} from "@tabler/icons-react";
import {dislikeMovie} from "@api/recommendMovieApi.js";

function MovieList({ movies, onDisLike}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [selectedMovie, setSelectedMovie] = useState(null)

    const [dislikedForMonthStatus, setDislikedForMonthStatus] = useState({});

    const closeModal = () => {
        setIsModalOpen(false);
        setTrailerUrl("");
    };

    const handleToggleDislikeForMonth = async (e, movieId) => {
        e.stopPropagation(); // 카드 클릭 이벤트 방지

        // 현재 상태를 반전시켜 onDisLike 함수에 전달
        // true: 한 달 동안 비추천, false: 비추천 해제
        const newStatus = !dislikedForMonthStatus[movieId];

        // onDisLike 함수는 영화를 목록에서 제거하는 역할을 하므로,
        // 이 아이콘 클릭은 "한 달 동안 추천하지 않기" 즉, "비추천"과 동일하게 처리합니다.
        // onDisLike 함수가 성공적으로 실행되면, 해당 영화는 리스트에서 사라질 것입니다.
        try {
            // onDisLike 함수에 movieKey만 전달하거나, 추가적인 상태 정보를 전달할 수 있습니다.
            // 예: onDisLike(movieId, newStatus);
            await dislikeMovie(movieId)
            onDisLike(movieId); // 영화를 리스트에서 제거 (RecommendMoviePage에서 처리)

            // onDisLike가 성공적으로 호출되면 해당 영화는 목록에서 사라질 것이므로,
            // 여기서 dislikedForMonthStatus를 직접 업데이트할 필요는 없을 수 있습니다.
            // 하지만 만약 영화가 목록에서 사라지지 않고 단순히 "한 달 동안 추천하지 않기" 상태만 변경된다면,
            // 아래 setDislikedForMonthStatus 로직이 필요합니다.
            setDislikedForMonthStatus(prev => ({
                ...prev,
                [movieId]: newStatus // 상태 업데이트
            }));
            console.log(`Movie ${movieId} disliked for month: ${newStatus}`);
        } catch (error) {
            console.error("비추천 처리 실패:", error);
            // 에러 발생 시 상태 롤백 또는 사용자에게 알림
        }
    };

    const renderStars = (voteAverage) => {
        const starsRating = Math.round(voteAverage / 2);

        const starsElements = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= starsRating){
                starsElements.push(
                    <IconCarambolaFilled
                        key={i}
                        size={10} // 명세된 크기
                        color="var(--primary-color)" // 활성 상태 색상을 테마 메인 색상으로 가정
                        className={"starIcon"}
                    />
                );
            }else{
                starsElements.push(
                    <IconCarambola
                        key={i}
                        size={10}
                        color="var(--primary-color)"
                        className={"starIcon"}
                    />
                );
            }
        }
        return starsElements;
    }

    return (
        <div className="movieList">
            {movies.slice(0, 6).map((movie) => (
                <div
                    key={movie.id}
                    className="movieCard"
                    onClick={() => {
                        setSelectedMovie(movie)
                        if (movie.trailerUrl) {
                            setTrailerUrl(movie.trailerUrl);
                        } else {
                            // 트레일러 없으면 모달 안 열림 or 알림 띄우기
                            setTrailerUrl("")
                        }
                        setIsModalOpen(true);
                    }}
                >
                    <img
                        src={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : "/no-image.png"
                        }
                        alt={movie.title}
                        className="moviePoster"
                    />
                    <div className="movieInfo">
                        <p className="movieTitle">{movie.title}</p>
                        <p className={"movieVote"}>
                            {renderStars(movie.vote_average)}</p>
                        <p className="movieOverview">{movie.overview || "줄거리 정보 없음"}</p>

                        <div
                            className={"dislikeForMonthContainer"}
                            onClick={(e) => handleToggleDislikeForMonth(e, movie.id)} // 클릭 시 바로 처리
                        >
                            {dislikedForMonthStatus[movie.id] ? (
                                <IconSquareCheck
                                    size={8}
                                    color="var(--primary-color)"
                                    className={"dislikeIcon"}
                                />
                            ) : (
                                <IconSquare
                                    size={8}
                                    color="var(--theme1-main-color)"
                                    className={"dislikeIcon"}
                                />
                            )}
                            <span className={"dislikeText"}> 한 달 동안 추천하지 않기</span>
                        </div>
                    </div>
                </div>
            ))}

            {isModalOpen && selectedMovie && (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {trailerUrl ? (
                            <iframe
                                width="100%"
                                height="400"
                                src={trailerUrl}
                                title="Movie Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        ) : (
                            <div className="overview-fallback">
                                <h2 className={"modal-title"}>{selectedMovie.title}</h2>
                                <h3 className={"modal-director"}>감독 : {selectedMovie.directorName}</h3>
                                <h3 className={"modal-cast"}>출연진 : {selectedMovie.castNames.join(', ')}</h3>
                                <p className={"modal-overview"}>{selectedMovie.overview || "줄거리 정보가 없습니다."}</p>
                            </div>
                        )}


                    </div>
                </div>
            )
            }
        </div>
    )
}
export default MovieList;