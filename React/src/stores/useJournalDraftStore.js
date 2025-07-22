import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * @description
 * 📚 저널 작성/수정 시 임시 데이터를 관리하는 Zustand 스토어입
 * 새 글은 'new', 수정 글은 'journalId'를 key로 사용하여 임시 데이터를 저장
 * 'persist' 미들웨어를 통해 sessionStorage에 데이터를 저장
 */
const useJournalDraftStore = create(
    persist(
        (set) => ({
            // drafts: { [journalId | 'new']: { title, content, rating, ... } }
            drafts: {},

            // 특정 저널의 임시 저장 데이터 업데이트/생성
            setDraft: (id, data) => set((state) => ({
                drafts: {
                    ...state.drafts,
                    [id]: {
                        ...(state.drafts[id] || {}), // 기존 데이터 유지 및 덮어쓰기
                        ...data,
                    },
                },
            })),

            // 특정 저널의 임시 저장 데이터 삭제 (저장 또는 닫기 시 호출)
            clearDraft: (id) => set((state) => {
                const newDrafts = { ...state.drafts };
                delete newDrafts[id];
                return { drafts: newDrafts };
            }),

            // 모든 임시 저장 데이터 초기화
            clearAllDrafts: () => set({ drafts: {} }),
        }),
        {
            name: 'journal-draft-storage', // sessionStorage에 저장될 고유 키
            storage: createJSONStorage(() => sessionStorage), // 세션 스토리지 사용
        }
    )
);

export default useJournalDraftStore;
