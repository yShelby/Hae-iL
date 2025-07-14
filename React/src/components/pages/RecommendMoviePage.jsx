import MovieList from "@features/recommend/MovieList.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import RecommendText from "@features/recommend/RecommendText.jsx";

function RecommendMoviePage(){

    const [movies, setMovies] = useState([]);
    const [emotion, setEmotion] = useState("기쁨/행복");

    useEffect(() => {
        axios.get(`/api/recommend/movies`,{
            withCredentials: true
        })
            .then((res) => {
                const data = res.data;
                const moviesArray = Array.isArray(data) ? data : data.movies || [];
                setMovies(moviesArray);
            })
            .catch((error) => {
                console.error("영화 추천 API 호출 실패:", error);
                setMovies([]);
            });
    }, []);


    return(
        <div>
            <RecommendText emotion={emotion}/>
            <MovieList movies={movies}/>
            <button>></button>
        </div>
    )
}

export default RecommendMoviePage;