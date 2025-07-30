import '../../pages/css/settingpage.css'

function TeamHaeilInfo() {

    const memberInfo = [
        {
            id: 0,
            img: '/images/members/developer_0.png',
            name: "최지호",
            position: "position",
            role: "role",
            email: "email",
        },
        {
            id: 1,
            img: '/images/members/developer_1.png',
            name: "김강민",
            position: "position",
            role: "role",
            email: "email",
        },
        {
            id: 2,
            img: '/images/members/developer_2.png',
            name: "김문철",
            position: "position",
            role: "role",
            email: "email",
        },
        {
            id: 3,
            img: '/images/members/developer_3.png',
            name: "류예슬 [총괄]",
            position: "프로젝트 메니저",
            role: [
                "기획",
                "아키텍처",
                "ERD 및 데이터 플로우",
                "감성사전 정제 및 라벨 선정",
                "자가진단 컨텐츠 및 백엔드 담당",
                "차트 페이지 담당",
                "일정 조율 및 발표",
            ],
            email: "email",
        },
        {
            id: 4,
            img: '/images/members/developer_4.png',
            name: "신다란",
            position: "position",
            role: "role",
            email: "email",
        },
    ]

    return (
        <div className={"team-info"}>
            {memberInfo.map((member) => {

                return (
                    <div key={member.id}
                         className={"team-info-wrapper"}>
                        <div className='member-img' style={{
                            backgroundImage: `url(${member.img})`,
                        }}></div>
                        <div className='member-info'>
                            <p style={{margin: 0}}>이 름 : {member.name}</p>
                            {/*<p style={{margin: 0}}>직 책 : {member.position}</p>*/}
                            {/*<p style={{margin: 0}}>담당 업무 : {member.role}</p>*/}
                            <p style={{margin: 0}}>이메일 : {member.email}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TeamHaeilInfo;