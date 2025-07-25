import { useQuery } from "@tanstack/react-query";
import { fetchSelfDiagnosisStatus } from "@api/selfDiagnosisApi.jsx";

export function useSelfDiagnosisStatus( year, month, date, enabled = true ) {

    return useQuery({
        queryKey: ['selfDiagnosisStatus', year, month, date ],
        queryFn: fetchSelfDiagnosisStatus,
        enabled, // 로그인 상태일 때만 요청
        staleTime: 1000 * 50 * 5, // 5분 캐시 유지
    });
}