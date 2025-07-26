import { useQuery } from "@tanstack/react-query";
import { fetchSelfDiagnosisStatus } from "@api/selfDiagnosisApi.js";

export function useSelfDiagnosisStatus( year, month, enabled = true ) {

    return useQuery({
        queryKey: ['selfDiagnosisStatus', year, month ],
        queryFn: fetchSelfDiagnosisStatus(year, month),
        enabled, // 로그인 상태일 때만 요청
        staleTime: 1000 * 50 * 5, // 5분 캐시 유지
    });
}