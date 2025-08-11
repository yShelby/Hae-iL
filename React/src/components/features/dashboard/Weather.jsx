import {useEffect, useState} from "react";
import {useWeatherData} from "@/hooks/useWeatherData.js";
import "./css/Weather.css";
import {FaMapMarkerAlt} from "react-icons/fa";

// 영문 날씨 상태를 한글로 변환하기 위한 객체
const WEATHER_IN_KOREAN = {
    Clear: '맑음',
    Clouds: '구름 많음',
    Rain: '비',
    Snow: '눈',
    Drizzle: '이슬비',
    Thunderstorm: '천둥번개',
    Mist: '안개',
    Smoke: '연기',
    Haze: '실안개',
    Dust: '먼지',
    Fog: '짙은 안개',
    Sand: '황사',
    Ash: '화산재',
    Squall: '돌풍',
    Tornado: '토네이도',
};

const getBackgroundClass = (weatherMain) => {
    const mapping = {
        'Clear': '맑음',
        'Clouds': '흐림',
        'Rain': '비옴',
        'Snow': '눈',
        'Drizzle': '비옴',
        'Thunderstorm': '태풍',
        'Mist': '부분 흐림',
        'Smoke': '부분 흐림',
        'Haze': '부분 흐림',
        'Dust': '황사',
        'Fog': '부분 흐림',
        'Sand': '황사',
        'Ash': '황사',
        'Squall': '바람',
        'Tornado': '태풍'
    };
    const categories = {
        '맑음': 'clear',
        '비옴': 'rain',
        '눈': 'snow',
        '흐림': 'cloudy',
        '부분 흐림': 'partly-cloudy',
        '황사': 'dust',
        '바람': 'wind',
        '태풍': 'storm'
    };
    const categoryKorean = mapping[weatherMain] || '맑음'; // 기본은 clear
    return categories[categoryKorean] || 'clear';
};

// [추가] 'YYYY년 M월 D일 (요일)' 형식의 날짜 문자열을 생성하는 헬퍼 함수
const getFormattedDate = () => {
    const today = new Date();
    const options = {year: 'numeric', month: 'long', day: 'numeric', weekday: 'short'};
    // 요일에만 괄호를 추가하기 위해 문자열을 분리하고 재조합
    // 1. 'YYYY년 MM월 DD일 요일' 형식의 문자열을 생성
    const dateString = today.toLocaleDateString('ko-KR', options);

    // 2. 마지막 공백의 위치를 찾는다. (날짜와 요일 구분점)
    const lastSpaceIndex = dateString.lastIndexOf(' ');

    // 3. 날짜 부분('YYYY년 MM월 DD일')과 요일 부분('요일')을 분리
    const datePart = dateString.substring(0, lastSpaceIndex);
    const weekdayPart = dateString.substring(lastSpaceIndex + 1);

    // 4. 날짜 부분에서 '년'을 공백으로 바꾸고, 요일 부분에 괄호를 추가하여 최종 문자열을 반환
    return `${datePart.replace('년', ' ')} (${weekdayPart})`;
};

const Weather = () => {
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
                setCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (e) => {
                console.error("Geolocation error: ", e);
                // ⚠️ 사용자 위치 정보 획득 실패 시, 기본 좌표 (서울) 설정
                setCoords({latitude: 37.5665, longitude: 126.9780});
            }
        );
    }, []);

    const {data: weatherResponse, isLoading, isError} = useWeatherData(coords);

    // [추가] 날짜 표시를 위해 getFormattedDate 함수를 호출
    const formattedDate = getFormattedDate();

    // 날씨 정보와 배경 동기화 로직
    // weatherResponse 가 있을 때만 backgroundClass 계산, 없으면 기본값
    const weatherMain = weatherResponse?.data.main;
    const backgroundClass = weatherMain ? getBackgroundClass(weatherMain) : "dust";


    return (
        <div className={"weather-widget-container"}>
            {weatherResponse?.data && (
                <div className={`weather-widget-inner ${backgroundClass}`}>
                    <div className="weather-container">
                        {isLoading && <div className="weather-message">날씨 정보 로딩 중...</div>}
                        {isError && <div className="weather-message">날씨를 가져올 수 없어요.</div>}
                        {weatherResponse?.data && (
                            // [수정] 4줄 레이아웃을 위해 새로운 구조로 변경
                            <div className="weather-content-container">
                                <div className="weather-top-section">
                                    {/* 1행: 날씨 아이콘 및 정보 */}
                                    <div className="weather-info-row">
                                        <div className="weather-icon-container">
                                            <img
                                                src={`https://openweathermap.org/img/wn/${weatherResponse.data.icon}@2x.png`}
                                                alt={weatherResponse.data.main}
                                                className="weather-icon"
                                            />
                                        </div>
                                        <p className="weather-info">
                                            {WEATHER_IN_KOREAN[weatherResponse.data.main] || weatherResponse.data.main}
                                        </p>
                                    </div>

                                    {/* 2행: 온도 */}
                                    <p className="weather-temp">
                                        {Math.round(weatherResponse.data.temp)}°C
                                    </p>
                                </div>

                                <div className="weather-bottom-section">
                                    {/* 3행: 날짜 */}
                                    <p className="weather-date">{formattedDate}</p>

                                    {/* 4행: 위치 */}
                                    <div className="weather-location">
                                        <FaMapMarkerAlt size="11px" className="weather-location-icon"/>
                                        <span className="weather-location-text">{weatherResponse.data.city}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {!weatherResponse?.data && (
                <div className={`weather-widget-inner ${backgroundClass}`}>
                    <div className="weather-container">
                        {isLoading && <div className="weather-message">날씨 정보 로딩 중...</div>}
                        {isError && <div className="weather-message">날씨를 가져올 수 없어요.</div>}
                        {weatherResponse?.data && (
                            // [수정] 4줄 레이아웃을 위해 새로운 구조로 변경
                            <div className="weather-content-container">
                                <div className="weather-top-section">
                                    {/* 1행: 날씨 아이콘 및 정보 */}
                                    <div className="weather-info-row">
                                        <div className="weather-icon-container">
                                            <img
                                                src={`https://openweathermap.org/img/wn/${weatherResponse.data.icon}@2x.png`}
                                                alt={weatherResponse.data.main}
                                                className="weather-icon"
                                            />
                                        </div>
                                        <p className="weather-info">
                                            {WEATHER_IN_KOREAN[weatherResponse.data.main] || weatherResponse.data.main}
                                        </p>
                                    </div>

                                    {/* 2행: 온도 */}
                                    <p className="weather-temp">
                                        {Math.round(weatherResponse.data.temp)}°C
                                    </p>
                                </div>

                                <div className="weather-bottom-section">
                                    {/* 3행: 날짜 */}
                                    <p className="weather-date">{formattedDate}</p>

                                    {/* 4행: 위치 */}
                                    <div className="weather-location">
                                        <FaMapMarkerAlt size="11px" className="weather-location-icon"/>
                                        <span className="weather-location-text">{weatherResponse.data.city}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Weather;