import { useQuery } from "@tanstack/react-query";
import { fetchSelfDiagnosisStatus } from "@api/selfDiagnosisApi.js";

export function useSelfDiagnosisStatus( year, month, enabled = true ) {

    return useQuery({
        queryKey: ['selfDiagnosisStatus', year, month],
        queryFn: () => fetchSelfDiagnosisStatus(year, month),
        enabled,
        staleTime: 1000 * 50 * 5,
    });
}