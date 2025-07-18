package com.heaildairy.www.recommend.movie.movieservice;

import com.heaildairy.www.emotion.entity.MoodDetail;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class MoodCacheService {

    private final Map<Integer, List<MoodDetail>> moodCache = new ConcurrentHashMap<>();

    public List<MoodDetail> getCachedMoods(Integer userId) {
        return moodCache.getOrDefault(userId, List.of());
    }

    public void updateCachedMoods(Integer userId, List<MoodDetail> moodDetails) {
        moodCache.put(userId, new ArrayList<>(moodDetails));
    }
}
