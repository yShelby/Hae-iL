import "./css/JournalForm.css";
import {forwardRef, useCallback, useEffect, useState} from "react";
import {FaCalendarAlt, FaRegStar, FaStar} from "react-icons/fa";
import Rating from "react-rating";
import {showToast} from "@shared/UI/Toast.jsx";
import DatePicker, {registerLocale} from "react-datepicker";
import ko from "date-fns/locale/ko";
import useJournalDraftStore from "@/stores/useJournalDraftStore.js";
import Button from "@shared/styles/Button.jsx";
import Input from "@shared/styles/Input.jsx";

// 1. 기존 'ko' 로케일 객체를 복사
// 2. options.weekStartsOn 값을 1로 명시하여 '월요일' 시작을 강제(0: 일요일, 1: 월요일)
const koMondayStart = {
    ...ko,
    options: {
        ...ko.options,
        weekStartsOn: 1,
    },
};
// 3. 새로 만든 로케일 객체를 'ko-monday'라는 이름으로 등록
registerLocale("ko-monday", koMondayStart);

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

// forwardRef를 사용하여 DatePicker로부터 ref를 전달받아 접근성을 유지
const CustomDateButton = forwardRef(({value, onClick}, ref) => (
    <button type="button" className="custom-date-button" onClick={onClick} ref={ref}>
        {value}
        <FaCalendarAlt className="calendar-icon"/>
    </button>
));
// displayName 추가 (디버깅 시 유용)
CustomDateButton.displayName = 'CustomDateButton';

export const JournalForm = (
    {onSubmit, onCancel, initialData, isSubmitting, draftKey}) => { // 의존성 추가
    // [추가] 저널 임시 저장 스토어 연동
    const { drafts, setDraft } = useJournalDraftStore();
    const draft = drafts[draftKey]; // 현재 저널의 임시 데이터

    // Form은 자신의 UI 상태(formData)를 직접 관리
    const [formData, setFormData] = useState(getInitialFormData());
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

    // 부모로부터 받은 initialData가 변경될 때마다 Form의 상태를 동기화
    useEffect(() => {
        if (initialData) {
            // [추가] 수정 모드: API 데이터 또는 임시 데이터를 병합하여 사용(임시 데이터 우선)
            const source = draft || initialData;
            setFormData({
                title: source.title || '',
                content: source.content || '',
                category: source.category || 'MOVIE',
                rating: source.rating ?? 2.5, // 0도 유효한 값이므로 ?? 사용
                journalDate: source.journalDate ? new Date(source.journalDate)
                    .toISOString().split('T')[0] : getTodayString(),
            });
        }
        // 작성 모드라면 초기값으로 폼 리셋
        else {
            // 새 작성 모드: 임시 데이터가 있으면 사용, 없으면 초기값
            setFormData(draft || getInitialFormData());
        }
    }, [initialData, draft, draftKey]); // 의존성 추가

    // [추가] 폼 데이터 변경 시 임시 저장하는 로직
    const updateFormAndDraft = useCallback((newFormData) => {
        setFormData(newFormData);
        setDraft(draftKey, newFormData);
    }, [draftKey, setDraft]);

    // 폼 입력 변경 시 상태 업데이트
    const handleChange = (e) => {
        const {name, value} = e.target;
        // setFormData(prev => ({...prev, [name]: value}));
        updateFormAndDraft({ ...formData, [name]: value });
    };

    // 별점 선택 변경 시 상태 업데이트
    const handleRatingChange = (rate) => {
        // setFormData(prev => ({...prev, rating: rate}));
        updateFormAndDraft({ ...formData, rating: rate });
    };

    const handleDateChange = (date) => {
        // date가 null이거나 undefined가 아닌, 유효한 Date 객체일 때만 실행
        if (date) {
            // setFormData(prev => ({
            //     ...prev,
            //     journalDate: date.toISOString().split('T')[0]
            // }));
            updateFormAndDraft({ ...formData,
                journalDate: date.toISOString().split('T')[0] });
        }
        // 만약 날짜가 지워져서 null이 들어온 경우, 아무 작업도 하지 않아 이전 값을 유지하거나
        // 혹은 기본값으로 설정 가능. 여기서는 이전 값을 유지하도록 한다
    };

    // 커스텀 드롭다운에서 카테고리 선택 시
    const handleCategorySelect = (categoryKey) => {
        updateFormAndDraft({ ...formData, category: categoryKey });
        setIsCategoryDropdownOpen(false); // 선택 후 드롭다운 닫기
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
    const selectedCategoryName = CATEGORIES.find(cat => cat.key === formData.category)?.name || '선택하세요';

    return (
        <form className="journal-form" onSubmit={handleSubmit}>
            {/* 제목 입력 필드 */}
            <div className="form-group">
                <label htmlFor="title"></label>
                <Input type="text" id="title" name="title" placeholder={"제목"} value={formData.title} onChange={handleChange} required/>
            </div>

            <div className={"categoryArating"}>
                {/* 카테고리 선택 필드 */}
                {/*<div className="form-group">*/}
                {/*    <label htmlFor="category" className={"categoryLabel"}>카테고리</label>*/}
                {/*    <select id="category" name="category" placeholder={"카테고리"} value={formData.category} className={"categorySelecter"} onChange={handleChange}>*/}
                {/*        {CATEGORIES.map(cat => <option key={cat.key} value={cat.key}>{cat.name}</option>)}*/}
                {/*    </select>*/}
                {/*</div>*/}
                <div className="form-group category-select-wrapper">
                    <label htmlFor="category" className={"categoryLabel"}>카테고리</label>
                    <div
                        className={`custom-select-display ${isCategoryDropdownOpen ? 'open' : ''}`}
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    >
                        {selectedCategoryName}
                        <span className="dropdown-arrow">▼</span> {/* 화살표 아이콘 */}
                    </div>

                    {isCategoryDropdownOpen && (
                        <ul className="custom-select-options">
                            {CATEGORIES.map(cat => (
                                <li
                                    key={cat.key}
                                    className={`custom-select-option-item ${formData.category === cat.key ? 'active' : ''}`}
                                    onClick={() => handleCategorySelect(cat.key)}
                                >
                                    {cat.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 별점 선택 컴포넌트 */}
                <div className="form-group rating-plus">
                    <label className={"ratingLabel"}>별점</label>
                    <div className="rating-group">
                        <Rating
                            key={initialData ? initialData.id : 'new'} // initialData 변경 시 컴포넌트 리셋
                            fractions={2} // 0.5 단위 평가 가능
                            initialRating={formData.rating}
                            onChange={handleRatingChange}
                            emptySymbol={<FaRegStar size={24} color={"e0e0e0"}/>}
                            fullSymbol={<FaStar size={24} color={"f1c40f"}/>}
                        />
                    </div>
                </div>
            </div>

            {/* 날짜 입력 필드 */}
            <div className="form-group">
                <label></label>
                <div className="datepicker-container">
                    {/* 사용자에게 보여지는 버튼 역할 수행 */}
                    <label htmlFor="journalDatePicker" className="custom-date-label">
                        <span>{formData.journalDate}</span>
                        <FaCalendarAlt className="calendar-icon"/>
                    </label>
                    {/*
                    왜 max 속성만으로 미래 날짜 비활성화가 가능할까?

                  1. HTML5 표준 기능: <input type="date"> 태그의 'max' 속성은 HTML5 표준에 내장된 기능
                     우리가 직접 자바스크립트로 날짜를 비교하고, 클래스를 추가하고, 클릭을 막는 복잡한 로직을 짤 필요x

                  2. 브라우저의 역할: 'max' 속성에 "YYYY-MM-DD" 형식의 날짜를 지정해주면,
                     웹 브라우저가 알아서 달력 UI에서 해당 날짜 이후의 모든 날짜를 회색으로 비활성화 처리

                  3. 간결함과 효율성: 이 방식은 코드를 매우 간결하게 유지해주며, 불필요한 리렌더링이나
                     복잡한 상태 관리를 피할 수 있게 해주는 가장 효율적인 방법

                  (참고: DashboardCalendar는 <div>로 직접 만든 커스텀 달력이기 때문에,
                   이런 브라우저 기본 기능을 사용할 수 없어 직접 비활성화 로직을 구현 필요.)
                */}
                    <DatePicker
                        id="journalDatePicker"
                        locale={"ko-monday"} // 달력을 한글로 표시 (요일, 월 등). 이 옵션 덕분에 월요일부터 시작된다
                        selected={new Date(formData.journalDate)} // 현재 선택된 날짜를 Date 객체로 전달
                        onChange={handleDateChange}
                        dateFormat="yyyy-MM-dd"
                        maxDate={new Date()} // 선택 가능한 최대 날짜 (오늘까지)
                        className="hidden-datepicker"
                        popperPlacement="bottom" // 캘린더가 버튼 바로 아래 오른쪽에 위치하도록 설정
                        showMonthYearDropdown
                    />
                </div>
            </div>

            {/* 내용 입력 textarea */}
            <div className="form-group content-group">
                <label htmlFor="content"></label>
                <textarea id="content" name="content" placeholder={"내용을 입력하세요..."} value={formData.content}
                          onChange={handleChange} required/>
            </div>

            {/* 폼 동작 버튼 */}
            <div className="form-actions">
                <Button variant="button2" type="submit" active disabled={isSubmitting}>
                    {isSubmitting ? '저장 중...' : '저장'}
                </Button>
                <Button variant="button2" type="button" onClick={onCancel} disabled={isSubmitting}>닫기</Button>
            </div>
        </form>
    );
};
