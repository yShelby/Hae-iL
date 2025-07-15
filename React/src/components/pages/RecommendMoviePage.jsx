import MovieList from "@features/recommend/MovieList.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import RecommendText from "@features/recommend/RecommendText.jsx";
import {fetchEmotionByDiaryId} from "@api/emotionApi.js";

function RecommendMoviePage(){

    const [movies, setMovies] = useState([]);
    const [emotionResult, setEmotionResult] = useState(null);

    // useEffect(() => {
    //     axios.get(`/api/recommend/movies`, { withCredentials: true })
    //         .then((res) => {
    //             const data = res.data;
    //             // data가 배열이라면 감정별로 그룹핑
    //             if (Array.isArray(data)) {
    //                 const grouped = data.reduce((acc, movie) => {
    //                     const emotion = emotionResult.emotion_type || "기타";
    //                     if (!acc[emotion]) acc[emotion] = [];
    //                     acc[emotion].push(movie);
    //                     console.log(emotion)
    //                     return acc;
    //                 }, {});
    //                 setMovies(grouped);
    //             } else {
    //                 // 이미 감정별 객체라면 그대로 사용
    //                 setMovies(data.movies || {});
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("영화 추천 API 호출 실패:", error);
    //             setMovies({});
    //         });
    // }, []);
    useEffect(() => {
        // emotionResult가 준비되었을 때만 요청
        if (!emotionResult) return;

        axios.get(`/api/recommend/movies`, { withCredentials: true })
            .then((res) => {
                const data = res.data;

                const emotion = emotionResult.emotion_type || "기타";
                console.log("감정:", emotion)

                // data가 배열이라면 해당 감정으로 묶어서 그룹핑
                const grouped = Array.isArray(data)
                    ? { [emotion]: data }
                    : data.movies || {};

                setMovies(grouped);
            })
            .catch((error) => {
                console.error("영화 추천 API 호출 실패:", error);
                setMovies({});
            });
    }, [emotionResult]); // ✅ 감정 정보가 바뀔 때마다 실행


    return (
        <div>
            <RecommendText emotion={emotionResult?.emotion_type || "알 수 없음"} />
            <MovieList emotionToMovies={movies} />
            <button>></button>
        </div>
    )
}

export default RecommendMoviePage;