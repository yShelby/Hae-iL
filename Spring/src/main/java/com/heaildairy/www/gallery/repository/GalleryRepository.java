package com.heaildairy.www.gallery.repository;

import com.heaildairy.www.gallery.entity.GalleryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface GalleryRepository extends JpaRepository<GalleryEntity, UUID> {

}
