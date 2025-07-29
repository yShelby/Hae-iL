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
            name: "류예슬",
            position: "프로젝트 메니저",
            role: "role",
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
        <div style={{display: 'flex',flexWrap: 'wrap',width: '1200px'}}>
            {memberInfo.map((member) => {

                return (
                    <div key={member.id} style={{
                        display: 'flex',gap: '10px',
                        width: '350px', padding: "1rem",
                        border: '1px solid #fff', borderRadius: '25px',
                    }}>
                        <div className='member-img' style={{
                            width: '100px',height: '100px',
                            borderRadius: '50%',
                            backgroundImage: `url(${member.img})`,
                            backgroundPosition: 'center',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            margin: '15px',
                        }}></div>
                        <div className='member-info' style={{
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'space-between', alignItems: 'flex-start',gap: '3px',
                            height: '100%',
                        }}>
                            <p style={{margin: 0}}>이 름 : {member.name}</p>
                            <p style={{margin: 0}}>직 책 : {member.position}</p>
                            <p style={{margin: 0}}>담당 업무 : {member.role}</p>
                            <p style={{margin: 0}}>이메일 : {member.email}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default TeamHaeilInfo;