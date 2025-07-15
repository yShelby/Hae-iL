// // 📄 파일 경로: src/components/pages/CalendarPage.jsx
// // 📌 역할: React Big Calendar 라이브러리를 사용해 캘린더를 표시하는 페이지
// //
// // 💡 기능:
// // - 월별, 주별, 일별, 일정 목록 보기 등 다양한 뷰 제공
// // - date-fns를 사용한 날짜 지역화 처리
// // - 더블 클릭 시 해당 날짜의 일기 페이지로 이동하는 기능
// // - 마우스 오버 시 감정 데이터에 따라 날짜 배경색 변경 기능 (구현 예정)
//
// import React, { useState, useEffect } from 'react';
// import { Calendar, dateFnsLocalizer} from 'react-big-calendar';
// import { format, parse, startOfWeek, getDay } from 'date-fns';
// import ko from 'date-fns/locale/ko';
// import 'react-big-calendar/lib/css/react-big-calendar.css';
// import './css/CalendarCustom.css';
// import CustomCalendarToolbar from '@shared/UI/CustomCalendarToolbar.jsx'; // 커스텀 툴바
// import CustomDateCellWrapper from '@shared/UI/CustomDateCellWrapper.jsx'; // 커스텀 날짜 셀 래퍼
// import { fetchCalendarEntries } from '../../api/calendarApi'; // 캘린더 API
// import { useAuth } from '@features/auth/AuthContext.jsx';
// import { useCheckLogin } from '@/hooks/useCheckLogin.js';
// import { useNavigate } from 'react-router-dom';
//
// // 날짜 형식과 지역 설정 로케일 객체
// const locales = {
//   'ko': ko,
// };
//
// // date-fns를 Big Calendar와 사용 설정
// const localizer = dateFnsLocalizer({
//   format,
//   parse,
//   startOfWeek: (date) => startOfWeek(date, {weekStartsOn: 1}), // 달력 월요일부터 시작
//   getDay,
//   locales,
// });
//
// const CalendarPage = () => {
//   const { user, loading } = useAuth(); // user와 loading 상태 가져오기
//   const checkLogin = useCheckLogin(); // checkLogin 함수 가져오기
//   const navigate = useNavigate(); // useNavigate 훅 초기화
//
//   const [view, setView] = useState('month'); // 현재 뷰 상태 관리
//   const [currentDate, setCurrentDate] = useState(new Date()); // 현재 캘린더 날짜 상태 관리
//   const [events, setEvents] = useState([]); // 캘린더 이벤트 상태 관리
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
//
//   // 캘린더 데이터를 가져오기 - 비동기
//   const loadEvents = async (date) => {
//     try {
//       const year = date.getFullYear();
//       const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
//
//       const data = await fetchCalendarEntries(year, month);
//       console.log('Fetched calendar data:', data);
//
//       // 백엔드에서 받은 데이터를 react-big-calendar 형식으로 변환
//       const formattedEvents = data.map(savedDiary => ({
//         title: savedDiary.title,
//         start: new Date(savedDiary.diaryDate), // diaryDate를 Date 객체로 변환
//         end: new Date(savedDiary.diaryDate),   // 시작과 끝 날짜 동일하게 설정
//         allDay: true,
//         resource: savedDiary.moodScore, // moodScore를 resource로 저장하여 스타일링에 활용
//         diaryId: savedDiary.diaryId, // 일기 ID도 저장 (더블 클릭 시 이동 등에 활용 가능)
//       }));
//       setEvents(formattedEvents);
//     } catch (error) {
//       console.error('Failed to load calendar events:', error);
//       setEvents([]); // 에러 발생 시 이벤트 초기화
//     }
//   };
//
//   // currentDate 또는 user/loading 상태 변경 -> 데이터를 다시 불러옴
//   useEffect(() => {
//     if (!loading) { // useAuth의 로딩이 완료된 후에만 실행
//       setIsLoggedIn(!!user); // user 객체의 존재 여부에 따라 isLoggedIn 상태 업데이트
//     }
//   }, [user, loading]); // user 또는 loading 상태가 변경될 때마다 useEffect 재실행
//
//   // isLoggedIn 상태 변경 -> 캘린더 데이터를 로드하거나 초기화
//   useEffect(() => {
//     if (isLoggedIn) {
//       loadEvents(currentDate);
//     } else {
//       setEvents([]); // 비로그인 상태일 경우 이벤트 초기화
//     }
//   }, [isLoggedIn, currentDate]);
//
//   // 로그인 상태일 때의 이벤트 핸들러
//   const handleLoggedInDoubleClickEvent = (event) => {
//     console.log('Event double clicked! (Logged In)', event);
//     if (event.diaryId) {
//       navigate(`/diary/${event.diaryId}`);
//     } else {
//       navigate(`/diary/date/${format(event.start, 'yyyy-MM-dd')}`);
//     }
//   };
//
//   const handleLoggedInSelectSlot = (slotInfo) => {
//     console.log('Slot selected! (Logged In)', slotInfo);
//     if (slotInfo.action === 'doubleClick') {
//       console.log('Slot double clicked! (Logged In)', slotInfo);
//       navigate(`/diary/date/${format(slotInfo.start, 'yyyy-MM-dd')}`);
//     }
//   };
//
//   return (
//     <div style={{
//       width: '45vw', height: '65vh', padding: '20px',
//       marginTop: '5vw',
//       marginLeft: '17vw',
//       backgroundColor: '#d9f5f0'
//     }}>
//       <Calendar
//         localizer={localizer}
//         events={events}
//         startAccessor="start"
//         endAccessor="end"
//         selectable={true}
//         longPressThreshold={0}
//         style={{ width: '100%' }}
//         views={['month', 'week', 'day', 'agenda']}
//         view={view} // 현재 뷰 상태
//         onView={setView} // 뷰 변경 함수
//         date={currentDate} // 현재 날짜 상태
//         onNavigate={(newDate) => setCurrentDate(newDate)} // 날짜 이동 함수
//         components={{
//           toolbar: (toolbarProps) => (
//             <CustomCalendarToolbar {...toolbarProps} onView={setView} onNavigate={toolbarProps.onNavigate} />
//           ),
//           dayWrapper: (props) => <CustomDateCellWrapper {...props} events={events} />,
//         }}
//         onDoubleClickEvent={isLoggedIn ? handleLoggedInDoubleClickEvent : checkLogin}
//         onSelectSlot={isLoggedIn ? handleLoggedInSelectSlot : checkLogin}
//
//       />
//     </div>
//   );
// };
//
// export default CalendarPage;
//
