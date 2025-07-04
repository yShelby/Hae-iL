/**
 * @file dateUtils.js
 * @description 📅 날짜와 관련된 순수 함수들을 모아둔 유틸리티 모듈입니다.
 */

/**
 * formatDateToString
 * 🛠 기능: Date 객체를 'YYYY-MM-DD' 문자열로 변환
 * 🔄 데이터 흐름:
 *   1️⃣ 입력으로 받은 Date 객체 유효성 검사
 *   2️⃣ 연도, 월, 일을 추출하고 (월은 0부터 시작해서 +1)
 *   3️⃣ 두 자리 문자열로 맞춤 (월/일 1자리일 경우 앞에 '0' 추가)
 *   4️⃣ 'YYYY-MM-DD' 형태로 조합해 문자열 반환
 *
 * @param {Date} date - 변환 대상 Date 객체
 * @returns {string} 'YYYY-MM-DD' 형식 문자열, 유효하지 않으면 빈 문자열 반환
 */
export const formatDateToString = (date) => {
    // 1️⃣ Date 객체 유효성 체크 (유효하지 않으면 '' 반환)
    if (!(date instanceof Date) || isNaN(date)) {
        return '';
    }

    // 2️⃣ 연, 월(+1), 일을 각각 추출하고 2자리 문자열 맞춤
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 01 ~ 12
    const day = String(date.getDate()).padStart(2, '0');        // 01 ~ 31

    // 3️⃣ 최종 문자열 반환 (예: "2025-07-01")
    return `${year}-${month}-${day}`;
};

/**
 * formatStringToDate
 * 🛠 기능: 'YYYY-MM-DD' 문자열을 Date 객체로 변환
 * 🔄 데이터 흐름:
 *   1️⃣ 입력값이 존재하고 문자열인지 확인
 *   2️⃣ Date 객체 생성 (new Date(dateString))
 *   3️⃣ 생성된 Date 유효성 검사 (시간값이 NaN인지)
 *   4️⃣ 유효하면 Date 객체 반환, 아니면 null 반환
 *
 * @param {string} dateString - 'YYYY-MM-DD' 형식 문자열
 * @returns {Date|null} 유효한 Date 객체 혹은 null
 */
export const formatStringToDate = (dateString) => {
    // 1️⃣ 입력 존재 및 문자열 타입 확인
    if (!dateString || typeof dateString !== 'string') return null;

    // 2️⃣ Date 객체 생성
    const date = new Date(dateString);

    // 3️⃣ 유효성 검사 (시간값이 NaN이면 유효하지 않음)
    if (isNaN(date.getTime())) {
        return null;
    }

    // 4️⃣ 유효한 Date 객체 반환
    return date;
};
