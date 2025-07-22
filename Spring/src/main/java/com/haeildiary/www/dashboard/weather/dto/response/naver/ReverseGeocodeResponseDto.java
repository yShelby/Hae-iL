package com.haeildiary.www.dashboard.weather.dto.response.naver;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReverseGeocodeResponseDto {

    private Result[] results;

    /**
     * "서울특별시 금천구" 와 같은 상세 주소 문자열을 추출하는 헬퍼 메서드.
     * @return "시/도 시/군/구" 형식의 주소 문자열
     */
    public String getDetailedAddress() {
        if (results == null || results.length == 0) {
            return "위치 정보 없음";
        }
        Region region = results[0].getRegion();
        // API 응답에서 시/도(area1)와 시/군/구(area2) 이름을 조합합니다.
        return region.getArea1().getName() + " " + region.getArea2().getName();
    }

    /**
     * 응답의 'results' 배열 내의 각 결과 객체.
     */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Result {
        private Region region;
    }

    /**
     * 지역 정보를 담고 있는 'region' 객체.
     */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Region {
        private Area area1; // 시/도 정보를 담는 객체
        private Area area2; // 시/군/구 정보를 담는 객체
    }

    /**
     * 각 지역 단위(시/도, 시/군/구 등)의 이름을 담는 객체.
     */
    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Area {
        private String name;
    }

}
