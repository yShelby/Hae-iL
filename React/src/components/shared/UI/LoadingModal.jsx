import './css/LoadingModal.css'

export function LoadingModal() {
    return (
        <div className="loading-modal-overlay">
            <div className="loading-modal-content">
                <p>🔍 분석 결과 컨텐츠 추천 중입니다. 기다려 주세요...</p>
                <div className="spinner" />
            </div>
        </div>
    );
}