import MovieList from "@features/recommend/MovieList.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import RecommendText from "@features/recommend/RecommendText.jsx";

function RecommendMoviePage(){

    const [movies, setMovies] = useState([]);
    const [emotion, setEmotion] = useState("기쁨/행복");

    useEffect(() => {
        axios.get(`/api/recommend?emotionType=${encodeURIComponent(emotion)}`)  // 예시 URL
            .then((res) => setMovies(res.data))
            .catch((error) => {
                console.error("영화 추천 API 호출 실패:", error);
                setMovies([]);
            })
        ;
    }, [emotion]);

    return(
        <div>
            <RecommendText emotion={emotion}/>
            <MovieList movies={movies}/>
            <button>></button>
        </div>
    )
}

export default RecommendMoviePage;