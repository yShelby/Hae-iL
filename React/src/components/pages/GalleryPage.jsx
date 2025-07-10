import {useGallery} from "@features/gallery/GalleryContext.jsx";
import {useEffect} from "react";
import GalleryModal from "@features/gallery/GalleryModal.jsx";

const GalleryPage = () => {
    const {openGallery} = useGallery();

    useEffect(() => {
        openGallery(); // 페이지가 열리면 모달을 강제로 연다
    }, []);

    return null; // 🧹 실제 UI는 DiaryLayout에서 제공하므로 렌더링 없음
}

export default GalleryPage;