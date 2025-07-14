import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { getTodayQuestionAPI } from "@api/questionApi.js";

// 1. Context 생성
const QuestionContext = createContext();

// 2. Context를 사용하기 쉽게 만들어주는 커스텀 훅
export const useQuestion = () => useContext(QuestionContext);

// 3. 상태와 함수를 하위 컴포넌트에 제공하는 Provider 컴포넌트
export const QuestionProvider = ({ children }) => {
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    /**
     * API를 호출하여 질문을 새로고침하고 상태를 업데이트하는 함수
     * useCallback을 사용하여 불필요한 재성성을 방지
     */
    const refreshQuestion = useCallback(async () => {
        setIsLoading(true);
        try {
            const { questionText } = await getTodayQuestionAPI();
            setQuestion(questionText);
        } catch (error) {
            setQuestion("질문을 불러오는 데 실패했습니다.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 앱이 처음 시작될 때 최초 질문을 한 번만 가져온다
    useEffect(() => {
        refreshQuestion();
    }, [refreshQuestion]);

    // 하위 컴포넌트에 공유할 값들을 value로 전달
    const value = { question, isLoading, refreshQuestion };

    return (
        <QuestionContext.Provider value={value}>
            {children}
        </QuestionContext.Provider>
    );
};
