package com.heaildairy.www.gallery.service;


import com.heaildairy.www.gallery.dto.GalleryDTO;
import com.heaildairy.www.gallery.entity.GalleryEntity;
import com.heaildairy.www.gallery.repository.GalleryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class GalleryService {

    private final GalleryRepository galleryRepository;

    public void save(GalleryDTO dto){
        GalleryEntity order = new GalleryEntity(dto.menu(), dto.count());
        galleryRepository.save(order);
    }

}
