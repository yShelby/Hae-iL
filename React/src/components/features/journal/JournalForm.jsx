import "./css/JournalForm.css";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Button} from "@shared/UI/Button.jsx";
import {FaStar} from "react-icons/fa";

const CATEGORIES = [
    { key: "all", name: "전체보기"},
    { key: "movie", name: "🎬 영화"},
    { key: "book", name: "📖 책"},
    { key: "music", name: "🎵 음악"},
    { key: "etc", name: "기타"},
];

export const JournalForm = ({onSubmit}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'MOVIE',
        rating: 2.5,
        journalDate: new Date().toISOString().split('T')[0], // 오늘 날짜를 기본값으로 설정
    });
    const [hoverRating, setHoverRating] = useState(0);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (rate) => {
        setFormData(prev => ({ ...prev, rating: rate}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(formData.rating === 0) {
            alert("별점을 선택해주세요.");
            return;
        }
        onSubmit(formData);
    };

    return (
        <form className="journal-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="title">제목</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label htmlFor="category">카테고리</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange}>
                    {CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{cat.name}</option>)}
                </select>
            </div>

            <div className="form-group">
                <label>별점</label>
                <div className="rating-group">
                    {Array.from({ length: 5 }).map((_, index) => {
                        const rate = index + 1;
                        return (
                            <FaStar
                                key={rate}
                                className={`star ${rate <= (hoverRating || formData.rating) ? 'active' : ''}`}
                                onClick={() => handleRatingChange(rate)}
                                onMouseEnter={() => setHoverRating(rate)}
                                onMouseLeave={() => setHoverRating(0)}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="journalDate">날짜</label>
                <input type="date" id="journalDate" name="journalDate" value={formData.journalDate} onChange={handleChange} required />
            </div>

            <div className="form-group">
                <label htmlFor="content">내용</label>
                <textarea id="content" name="content" value={formData.content} onChange={handleChange} required />
            </div>

            <div className="form-actions">
                <Button type="button" onClick={() => navigate(-1)}>취소</Button>
                <Button type="submit" active>저장</Button>
            </div>
        </form>
    );
};