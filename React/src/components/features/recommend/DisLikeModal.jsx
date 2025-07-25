import './css/MovieList.css'
import {dislikeMovie} from "@api/recommendMovieApi.js";

function DisLikeModal({ onClose, movieKey, onDisLike}) {

    const handleDisLike = async () =>{
        console.log("movieKey : ", movieKey)
        try {
            await dislikeMovie(movieKey)
            console.log("movieKey : ", movieKey)
            alert("영화가 싫어요 목록에 추가되었습니다.");
            onDisLike(movieKey);
        }
        catch (error) {
            console.error("영화 싫어요 추가 실패:", error);
            console.log("movieKey : ", movieKey)
            alert("영화 싫어요 추가에 실패했습니다. 나중에 다시 시도해주세요.");
        } finally {
            onClose(); // 모달 닫기
        }
    }

    return (
        <div className="dislike-modal" onClick={e => e.stopPropagation()}>
            <button onClick={handleDisLike}>싫어요에 추가</button>
        </div>
    );
}

export default DisLikeModal;