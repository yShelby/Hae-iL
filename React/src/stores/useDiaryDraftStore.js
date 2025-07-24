import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * @description
 * ✍️ 일기 작성 시 임시 데이터를 관리하는 Zustand 스토어
 * 날짜(YYYY-MM-DD)를 key로 사용하여 각기 다른 날의 임시 데이터를 저장
 * 'persist' 미들웨어를 통해 sessionStorage에 데이터를 저장하여, 페이지를 새로고침해도 내용이 유지
 */
const useDiaryDraftStore = create(
    persist(
        (set, get) => ({
            // drafts: { [date (YYYY-MM-DD)]: { title, weather, content } }
            drafts: {},

            // 특정 날짜의 임시 저장 데이터 업데이트/생성
            setDraft: (date, data) => set((state) => ({
                drafts: {
                    ...state.drafts,
                    [date]: {
                        ...(state.drafts[date] || {}), // 기존 데이터가 있으면 유지하고 덮어쓰기
                        ...data,
                    },
                },
            })),

            // 특정 날짜의 임시 저장 데이터 삭제 (저장, 삭제, 닫기 시 호출)
            clearDraft: (date) => set((state) => {
                const newDrafts = { ...state.drafts };
                delete newDrafts[date];
                return { drafts: newDrafts };
            }),

            // // 모든 임시 저장 데이터 초기화 (로그아웃 등 필요시)
            // clearAllDrafts: () => set({ drafts: {} }),

            // 특정 날짜의 임시 저장 데이터를 가져온다.
            getDraft: date => get().drafts[date],
        }),
        {
            name: 'diary-draft-storage', // sessionStorage에 저장될 고유 키
            storage: createJSONStorage(() => sessionStorage), // 세션 스토리지 사용
        }
    )
);

export default useDiaryDraftStore;
