import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFortuneStatus, openFortune } from '../api/fortuneApi';
import {showToast} from "@shared/UI/Toast.jsx";
import {useAuth} from "@features/auth/AuthContext.jsx";

export const useFortuneCookie = () => {
    const {user} = useAuth();
    const queryClient = useQueryClient();

    // 쿼리: 포춘쿠키의 현재 상태를 조회하고 캐싱
    const { data: statusData, isLoading: isStatusLoading } = useQuery({
        queryKey: ['fortuneStatus'], // 이 쿼리의 고유 키
        queryFn: getFortuneStatus,   // API 호출 함수
        enabled: !!user,
    });

    // 뮤테이션: 쿠키를 여는 '액션'을 처리
    const { mutate: openCookie, isPending: isOpening, data: openResult } = useMutation({
        mutationFn: openFortune, // API 호출 함수
        onSuccess: () => {
            // 성공 콜백: 쿠키를 성공적으로 열면, 'fortuneStatus' 쿼리를 무효화시켜
            // 상태를 다시 불러오게 한다 (canOpen: false로 변경).
            queryClient.invalidateQueries({ queryKey: ['fortuneStatus'] });
        },
        onError: (error) => {
            // 실패 콜백: 서버에서 409 Conflict 등 에러 응답을 받았을 때 실행
            console.error("포춘쿠키 열기 실패:", error);
            showToast.error(error.response?.data || "이미 확인한 운세입니다.");
        }
    });

    return {
        status: statusData?.data,
        isStatusLoading,
        openCookie,
        isOpening,
        fortuneMessage: openResult?.data?.message,
    };
};
