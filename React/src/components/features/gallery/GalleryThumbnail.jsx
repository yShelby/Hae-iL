import {useCheckLogin} from "@/hooks/useCheckLogin.js";
import {useEffect, useState} from "react";
import {useGallery} from "@features/gallery/GalleryContext.jsx";
import {fetchGalleryImagesAPI} from "@api/galleryApi.js";

const DEFAULT_THUMBNAIL = '/images/Thumbnail.JPG';

const GalleryThumbnail = () => {
    const [thumbnailUrl, setThumbnailUrl] = useState(DEFAULT_THUMBNAIL);
    const checkLogin = useCheckLogin();
    const {openGallery} = useGallery();

    useEffect(() => {
        fetchGalleryImagesAPI()
            .then((res =>{
                const images = res.data;

                if(images.length > 0){
                    const latest = images[0];
                    const url = latest.fileKey
                        ? `https://${import.meta.env.VITE_AWS_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${latest.fileKey}`
                        : DEFAULT_THUMBNAIL;
                    setThumbnailUrl(url);
                }
            }))
            .catch((err) => {
                console.warn('갤러리 썸네일 로딩 실패 (무시됨)', err);
            })
    }, []);

    const handleClick = () => {
        if (!checkLogin()) return;
        openGallery();
    }

    return (
        <div className={"gallery-thumbnail-wrapper"} onClick={handleClick}>
            <img src={thumbnailUrl} alt="갤러리 썸네일" className="gallery-thumbnail-image"/>
        </div>
    )
}
export default GalleryThumbnail;