import React from "react";

function MovieList({ movie }) {

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [trailerUrl, setTrailerUrl] = React.useState("");

    return(
        <div onClick={() => {setTrailerUrl(movie.trailer); setIsModalOpen(true);}}>
            <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/no-image.png"}
                alt={movie.title}
                className={"movie-poster"}
            />
            <div>{movie.title}</div>
            <div>{movie.vote_average}</div>
            <div>{movie.overview}</div>
        </div>
    )
}

export default MovieList;