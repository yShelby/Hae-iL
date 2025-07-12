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

const getTodayString = () => new Date().toISOString().split('T')[0];

// 기본 폼 초기값, rating은 2.5로 초기화해 사용자가 별점을 일부러 안 주는 상황을 방지
const getInitialFormData = () => ({
    title: '',
    content: '',
    category: 'MOVIE',
    rating: 2.5,
    journalDate: getTodayString(),  // 오늘 날짜 (yyyy-mm-dd)
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
                {/* 왜 max 속성만으로 미래 날짜 비활성화가 가능할까?

                  1. HTML5 표준 기능: <input type="date"> 태그의 'max' 속성은 HTML5 표준에 내장된 기능
                     우리가 직접 자바스크립트로 날짜를 비교하고, 클래스를 추가하고, 클릭을 막는 복잡한 로직을 짤 필요x

                  2. 브라우저의 역할: 'max' 속성에 "YYYY-MM-DD" 형식의 날짜를 지정해주면,
                     웹 브라우저가 알아서 달력 UI에서 해당 날짜 이후의 모든 날짜를 회색으로 비활성화 처리

                  3. 간결함과 효율성: 이 방식은 코드를 매우 간결하게 유지해주며, 불필요한 리렌더링이나
                     복잡한 상태 관리를 피할 수 있게 해주는 가장 효율적인 방법

                  (참고: DashboardCalendar는 <div>로 직접 만든 커스텀 달력이기 때문에,
                   이런 브라우저 기본 기능을 사용할 수 없어 직접 비활성화 로직을 구현 필요.)
                */}
                <input
                    type="date"
                    id="journalDate"
                    name="journalDate"
                    value={formData.journalDate}
                    max={getTodayString()}
                    onChange={handleChange}
                    required
                />
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
