import "./css/JournalForm.css";
import {useEffect, useState} from "react";
import {Button} from "@shared/UI/Button.jsx";
import {FaRegStar, FaStar} from "react-icons/fa";
import Rating from "react-rating";
import {showToast} from "@shared/UI/Toast.jsx";

const CATEGORIES = [
    // enum 타입과 매핑하기 위해서 key값을 대문자로 해야 한다
    {key: "ALL", name: "all"},
    {key: "MOVIE", name: "🎬"},
    {key: "BOOK", name: "📖"},
    {key: "MUSIC", name: "🎵"},
    {key: "ETC", name: "etc"},
];

// 기본 폼 초기값, rating은 2.5로 초기화해 사용자가 별점을 일부러 안 주는 상황을 방지
const getInitialFormData = () => ({
    title: '',
    content: '',
    category: 'MOVIE',
    rating: 2.5,
    journalDate: new Date().toISOString().split('T')[0],  // 오늘 날짜 (yyyy-mm-dd)
});

export const JournalForm = ({ onSubmit, onCancel, initialData, isSubmitting }) => {
    // Form은 자신의 UI 상태(formData)를 직접 관리합니다.
    const [formData, setFormData] = useState(getInitialFormData());

    // 부모로부터 받은 initialData가 변경될 때마다 Form의 상태를 동기화
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                category: initialData.category || 'MOVIE',
                rating: initialData.rating || 0,  // 수정 모드일 땐 초기 rating 반영
                journalDate: initialData.journalDate ? new Date(initialData.journalDate).toISOString().split('T')[0] : getInitialFormData().journalDate,
            });
        }
        // 작성 모드라면 초기값으로 폼 리셋
        else {
            setFormData(getInitialFormData());
        }
    }, [initialData]);

    // 폼 입력 변경 시 상태 업데이트
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    // 별점 선택 변경 시 상태 업데이트
    const handleRatingChange = (rate) => {
        setFormData(prev => ({...prev, rating: rate}));
    };

    // 제출 시 유효성 검사 및 onSubmit 호출
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.rating === 0) {
            showToast.error("별점을 0.5점 이상 선택해주세요.");  // 최소 0.5 이상 별점 요구
            return;
        }
        onSubmit(formData);
    };

    return (
        <form className="journal-form" onSubmit={handleSubmit}>
            {/* 제목 입력 필드 */}
            <div className="form-group">
                <label htmlFor="title">제목</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required/>
            </div>

            {/* 카테고리 선택 필드 */}
            <div className="form-group">
                <label htmlFor="category">카테고리</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange}>
                    {CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{cat.name}</option>)}
                </select>
            </div>

            {/* 별점 선택 컴포넌트 */}
            <div className="form-group">
                <label>별점</label>
                <div className="rating-group">
                    <Rating
                        key={initialData ? initialData.id : 'new'} // initialData 변경 시 컴포넌트 리셋
                        fractions={2} // 0.5 단위 평가 가능
                        initialRating={formData.rating}
                        onChange={handleRatingChange}
                        emptySymbol={<FaRegStar size={24} color={"e0e0e0"} />}
                        fullSymbol={<FaStar size={24} color={"f1c40f"} />}
                    />
                </div>
            </div>

            {/* 날짜 입력 필드 */}
            <div className="form-group">
                <label htmlFor="journalDate">날짜</label>
                <input type="date" id="journalDate" name="journalDate" value={formData.journalDate}
                       onChange={handleChange} required/>
            </div>

            {/* 내용 입력 textarea */}
            <div className="form-group content-group">
                <label htmlFor="content">내용</label>
                <textarea id="content" name="content" value={formData.content}
                          onChange={handleChange} required/>
            </div>

            {/* 폼 동작 버튼 */}
            <div className="form-actions">
                <Button type="button" onClick={onCancel} disabled={isSubmitting}>닫기</Button>
                <Button type="submit" active disabled={isSubmitting}>
                    {isSubmitting ? '저장 중...' : '저장'}
                </Button>
            </div>
        </form>
    );
};
