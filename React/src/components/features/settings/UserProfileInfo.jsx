import React from 'react';

function UserProfileInfo({ user }) {
    if (!user) return null;

    const genres = user.initialGenre || [];
    const emotions = user.initialEmotion || [];

    return (
        <section className="user-profile-info" style={{ marginBottom: '2rem' }}>
            {/*<h3>내 정보</h3>*/}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div>
                    <p><strong>닉네임:</strong> {user.nickname}</p>
                    <p><strong>이메일:</strong> {user.email}</p>
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <h4>좋아하는 영화 장르</h4>
                {genres.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {genres.map((genre, i) => (
                            <span key={i} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#eef', borderRadius: '12px' }}>
                {genre}
              </span>
                        ))}
                    </div>
                ) : (
                    <p>등록된 선호 장르가 없습니다.</p>
                )}
            </div>

            <div>
                <h4>최근 자주 느낀 감정</h4>
                {emotions.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {emotions.map((emotion, i) => (
                            <span key={i} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#fee', borderRadius: '12px' }}>
                {emotion}
              </span>
                        ))}
                    </div>
                ) : (
                    <p>등록된 감정 정보가 없습니다.</p>
                )}
            </div>
        </section>
    );
}

export default UserProfileInfo;
