import React from "react";
import './css/MovieList.css'

function MovieList({ emotionToMovies }) {
    const emotionKeys = Object.keys(emotionToMovies);
    const [currentEmotionIndex, setCurrentEmotionIndex] = React.useState(0);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [trailerUrl, setTrailerUrl] = React.useState("");

    const currentEmotion = emotionKeys[currentEmotionIndex];
    const movies = emotionToMovies?.[currentEmotion] ?? [];

    const closeModal = () => {
        setIsModalOpen(false);
        setTrailerUrl("");
    };

    const nextEmotion = () => {
        if (currentEmotionIndex < emotionKeys.length - 1) {
            setCurrentEmotionIndex(currentEmotionIndex + 1);
        }
    };

    return (
        <div>
            {movies.slice(0, 6).map((movie) => (
                <div
                    key={movie.id}
                    className="movie-card"
                    onClick={() => {
                        if (movie.trailer) {
                            setTrailerUrl(movie.trailer);
                            setIsModalOpen(true);
                        } else {
                            // 트레일러 없으면 모달 안 열림 or 알림 띄우기
                            alert("트레일러 정보가 없습니다.");
                        }
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
                        <p className="movie-overview">{movie.overview || "줄거리 정보 없음"}</p>
                    </div>
                </div>
            ))}

            {isModalOpen && trailerUrl ? (
                <div className="modal-backdrop" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <iframe
                            width="100%"
                            height="400"
                            src={trailerUrl}
                            title="Movie Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                        <button onClick={closeModal} className="close-btn">닫기</button>
                    </div>
                </div>
            ) : null}

                <button className="next-emotion-btn" onClick={nextEmotion}>
                    다음 감정 보기
                </button>
        </div>
    );
}

export default MovieList;