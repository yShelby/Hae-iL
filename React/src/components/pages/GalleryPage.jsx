import {useGallery} from "@features/gallery/GalleryContext.jsx";
import {useEffect} from "react";
import GalleryModal from "@features/gallery/GalleryModal.jsx";

const GalleryPage = () => {
    const {openGallery} = useGallery();

    useEffect(() => {
        openGallery(); // 페이지가 열리면 모달을 강제로 연다
    }, openGallery);

    return (<GalleryModal />);
}

export default GalleryPage;