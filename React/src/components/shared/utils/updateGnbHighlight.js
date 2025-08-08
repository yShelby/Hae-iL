/**
 * 경로에 따라 GNB 메뉴 하이라이트를 갱신합니다.
 * @param {string} path - 현재 이동하려는 경로
 */
export function updateGnbHighlight(path) {
    const virtualPath = (() => {
        if (path.startsWith('/diary/date')) return '/diary';
        if (path.startsWith('/journal')) return '/journal';
        if (path === '/gallery') return '/diary'; // 갤러리는 diary와 연결
        return path;
    })();

    const menuLinks = document.querySelectorAll('.gnb a.menu');
    menuLinks.forEach(link => link.classList.remove('selected'));

    const target = Array.from(menuLinks).find(link => link.getAttribute('data-path') === virtualPath);
    if (target) target.classList.add('selected');
}

/**
 * GNB 하이라이트를 지연시켜 갱신합니다 (예: 라우팅 직후 DOM이 준비되도록).
 * @param {string} path - 현재 이동하려는 경로
 * @param {number} [delay=50] - 지연 시간 (기본 50ms)
 */
export function updateGnbHighlightDelayed(path, delay = 50) {
    setTimeout(() => updateGnbHighlight(path), delay);
}