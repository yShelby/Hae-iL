import React from "react";

function MovieList({ movies }) {

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [trailerUrl, setTrailerUrl] = React.useState("");

    return(
        <div>
            {movies.map((movie) => (
                <div
                    key={movie.id}
                    className="movie-card"
                    onClick={() => {
                        fetchTrailer(movie.id);
                        setTrailerUrl(movie.trailer); // 또는 실제 트레일러 URL
                        setIsModalOpen(true);
                    }}
                >
                    <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-image.png"}
                        alt={movie.title}
                        className="movie-poster"
                    />
                    <div className="movie-info">
                        <h2 className="movie-title">{movie.title}</h2>
                        <p className="movie-overview">{movie.overview || "줄거리 정보 없음"}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MovieList;