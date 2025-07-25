package com.haeildiary.www.recommend.movie.movieservice;

import com.haeildiary.www.recommend.movie.movieresponse.MovieListResponse;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RecommendationCacheService {
    private final Map<Integer, MovieListResponse> recommendationCache = new ConcurrentHashMap<>();

    public MovieListResponse getCachedRecommendation(Integer userId) {
        return recommendationCache.get(userId);
    }

    public void updateCachedRecommendation(Integer userId, MovieListResponse response) {
        recommendationCache.put(userId, response);
    }
}
