export const DAILY_MISSIONS = [
    { id: 'diary', text: '일기 쓰기' },
    { id: 'sleep', text: '수면 기록하기' },
    { id: 'exercise', text: '운동 기록하기' },
    { id: 'meal', text: '식사 기록하기' },
    { id: 'journaling', text: '저널링 하기' },
];

// 각 미션 ID에 해당하는 페이지 경로를 매핑하는 객체
// 이 객체를 사용하여 클릭 시 올바른 페이지로 동적 라우팅을 구현
export const MISSION_NAV_PATHS = {
    diary: '/diary/new',
    sleep: '/diary',
    exercise: '/diary',
    meal: '/diary',
    journaling: '/journal',
};
