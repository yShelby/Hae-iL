import './css/RecommendText.css'

function RecommendText({emotion}){

    const List = [
        { "emotion": "슬픔/우울", "text": "마음이 무거울 때 위로가 되어줄 영화입니다." },
        { "emotion": "슬픔/우울", "text": "지친 하루 끝, 조용히 감정을 어루만질 작품이에요." },
        { "emotion": "슬픔/우울", "text": "가슴속 응어리를 풀어줄 영화가 여기 있어요." },
        { "emotion": "슬픔/우울", "text": "감정을 꾹꾹 눌러 담은 진심 어린 이야기입니다." },
        { "emotion": "슬픔/우울", "text": "당신의 우울을 이해해줄 영화 한 편." },
        { "emotion": "슬픔/우울", "text": "혼자 있기 싫은 날, 함께해줄 영화예요." },
        { "emotion": "기쁨/행복", "text": "좋은 기분을 더 높여줄 유쾌한 영화입니다!" },
        { "emotion": "기쁨/행복", "text": "행복한 당신에게 딱 맞는 에너지 넘치는 영화예요." },
        { "emotion": "기쁨/행복", "text": "기분 좋은 날엔 더 신나는 이야기가 필요하죠!" },
        { "emotion": "기쁨/행복", "text": "웃음이 멈추지 않는, 즐거움을 더해줄 영화입니다." },
        { "emotion": "기쁨/행복", "text": "이 기분 그대로! 활력을 더해줄 작품이에요." },
        { "emotion": "기쁨/행복", "text": "행복한 순간을 더욱 특별하게 만들어줄 영화예요." },
        { "emotion": "평온/만족", "text": "마음이 편안해지는 잔잔한 이야기를 담았어요." },
        { "emotion": "평온/만족", "text": "평온한 기분을 유지해줄 따뜻한 영화입니다." },
        { "emotion": "평온/만족", "text": "조용한 하루에 잘 어울리는 감성적인 작품이에요." },
        { "emotion": "평온/만족", "text": "잔잔한 위로와 소소한 행복이 담긴 영화예요." },
        { "emotion": "평온/만족", "text": "마음을 안정시켜주는 고요한 이야기입니다." },
        { "emotion": "평온/만족", "text": "편안함 속에서 삶을 되돌아보게 해주는 영화예요." },
        { "emotion": "불안/걱정", "text": "혼란스러운 마음을 잠시 잊게 해줄 영화입니다." },
        { "emotion": "불안/걱정", "text": "걱정이 많을 땐 몰입할 수 있는 이야기가 도움이 돼요." },
        { "emotion": "불안/걱정", "text": "불안한 생각을 잠재워줄 몰입도 높은 영화예요." },
        { "emotion": "불안/걱정", "text": "불안감을 덜어줄 따뜻한 시선의 영화입니다." },
        { "emotion": "불안/걱정", "text": "불확실한 마음에 작은 쉼표를 줄 영화예요." },
        { "emotion": "불안/걱정", "text": "지친 머리를 잠시 쉬게 해주는 스토리입니다." },
        { "emotion": "분노/짜증", "text": "화가 나는 날엔 속 시원한 영화가 필요하죠!" },
        { "emotion": "분노/짜증", "text": "짜증나는 기분, 통쾌한 이야기로 날려보세요." },
        { "emotion": "분노/짜증", "text": "울분을 시원하게 풀어주는 영화입니다." },
        { "emotion": "분노/짜증", "text": "답답한 하루, 확 뚫어줄 이야기예요." },
        { "emotion": "분노/짜증", "text": "기분 전환엔 강렬한 전개가 제격이죠!" },
        { "emotion": "분노/짜증", "text": "감정을 해소해줄 사이다 같은 영화입니다." },
        { "emotion": "지루/심심", "text": "심심할 땐 시간 순삭 영화가 최고예요!" },
        { "emotion": "지루/심심", "text": "따분한 하루에 재미를 더해줄 영화입니다." },
        { "emotion": "지루/심심", "text": "지루함을 날려줄 흥미진진한 이야기가 있어요." },
        { "emotion": "지루/심심", "text": "할 일 없을 땐 이 영화 한 편 어떠세요?" },
        { "emotion": "지루/심심", "text": "무료한 시간을 달래줄 몰입감 있는 작품이에요." },
        { "emotion": "지루/심심", "text": "심심함을 확 날려줄 영화, 준비했어요!" },
        { "emotion": "중립/기타", "text": "마음 한 켠에 잔잔히 스며드는 그런 영화입니다." },
        { "emotion": "중립/기타", "text": "특별하지 않아도 충분히 재미있는 영화입니다." },
        { "emotion": "중립/기타", "text": "평범한 일상 속 작은 쉼표 같은 영화입니다." },
        { "emotion": "중립/기타", "text": "부담 없이 편안하게 마음을 열 수 있는 작품입니다." },
        { "emotion": "중립/기타", "text": "크게 웃거나 울진 않아도, 마음이 따뜻해지는 순간들을 위한 영화입니다." },
        { "emotion": "중립/기타", "text": "가만히 있어도 좋고, 조용히 생각에 잠기게 하는 영화입니다." },
        { "emotion": "종합추천", "text": "어떤 기분이든 잘 어울리는, 모두를 위한 영화입니다." },
        { "emotion": "종합추천", "text": "웃음과 감동을 한 번에 느낄 수 있는 영화예요." },
        { "emotion": "종합추천", "text": "지친 하루를 다독여주는 종합 선물 같은 영화입니다." },
        { "emotion": "종합추천", "text": "가볍게 보기에도, 깊이 빠져들기에도 좋은 영화예요." },
        { "emotion": "종합추천", "text": "보고 나면 마음에 잔잔한 여운이 남는 영화입니다." },
        { "emotion": "종합추천", "text": "생각할 거리와 따뜻함을 동시에 안겨주는 영화예요." },
        { "emotion": "", "text": "일기를 작성해 보세요."}
    ]

    const textChoice = (emotion) => {
        const filteredList = List.filter(item => item.emotion === emotion);

        console.log("현재감정 : ",emotion)

        if (!filteredList.length) return "추천할 수 있는 영화가 없습니다.";

        const randomIndex = Math.floor(Math.random() * filteredList.length);

        return filteredList[randomIndex].text;
    };

    return(
        <div className={"movie-text-box"}>
            <p className={"today-movie"}>오늘의 추천 영화</p>
            <p className={"recommend-text"}>"{textChoice(emotion)}"</p>
        </div>
    )
}

export default RecommendText;