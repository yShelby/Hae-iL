import React, {useState} from "react";
import './css/MovieList.css'
import DisLikeModal from "@features/recommend/DisLikeModal.jsx";

function MovieList({ movies, emotion }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState("");
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [openDislikeModalMovieId, setOpenDislikeModalMovieId] = useState(null);

    const closeModal = () => {
        setIsModalOpen(false);
        setTrailerUrl("");
    };

    return (
        <div>
            <h3 className="emotion-title">🎭 감정: {emotion}</h3>
            <div className="movie-list">
                {movies.slice(0, 6).map((movie) => (
                    <div
                        key={movie.id}
                        className="movie-card"
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
                            className="movie-poster"
                        />
                        <div className="movie-info">
                            <h2 className="movie-title">{movie.title}</h2>
                            <h3 className={"movie-vote"}>{movie.vote_average}</h3>
                            <button
                                className="movie-plus"
                                onClick={(e) => {
                                    e.stopPropagation(); // 카드 클릭 이벤트 방지
                                    if (openDislikeModalMovieId === movie.id) {
                                        setOpenDislikeModalMovieId(null); // 닫기
                                    } else {
                                        setOpenDislikeModalMovieId(movie.id); // 열기
                                    }
                                }}
                            ></button>
                            {openDislikeModalMovieId === movie.id && (
                                <DisLikeModal movieKey={movie.id} onClose={() => setOpenDislikeModalMovieId(null)} />
                            )}
                            <p className="movie-overview">{movie.overview || "줄거리 정보 없음"}</p>
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

        </div>
    )
}
export default MovieList;