import './css/MovieList.css'
import {dislikeMovie, fetchDislikedMovies} from "@api/recommendMovieApi.js";
import {useState} from "react";

function DisLikeModal({ onClose, movieKey }) {

    const [dislikedMovies, setDislikedMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDisLike = async () =>{
        console.log("movieKey : ", movieKey)
        try {
            await dislikeMovie(movieKey)
            console.log("movieKey : ", movieKey)
            alert("영화가 싫어요 목록에 추가되었습니다.");
        }
        catch (error) {
            console.error("영화 싫어요 추가 실패:", error);
            console.log("movieKey : ", movieKey)
            alert("영화 싫어요 추가에 실패했습니다. 나중에 다시 시도해주세요.");
        } finally {
            onClose(); // 모달 닫기
        }
    }

    const handleCheckList = async () => {
        setLoading(true);
        setError(null);
        try {
            const movies = await fetchDislikedMovies();
            setDislikedMovies(movies);
        } catch (error) {
            console.error("싫어요 목록 조회 실패:", error);
            setError("싫어요 목록 조회에 실패했습니다. 나중에 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dislike-modal" onClick={e => e.stopPropagation()}>
            <button onClick={handleDisLike}>싫어요에 추가</button>
            <button onClick={handleCheckList}>목록 조회</button>

            {loading && <p>로딩중...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {dislikedMovies.length > 0 && (
                <ul className="disliked-movie-list">
                    {dislikedMovies.map(movie => (
                        <li key={movie.movieKey}>{movie.id}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DisLikeModal;