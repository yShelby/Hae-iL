package com.heaildairy.www.recommend.movie.movieservice;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.heaildairy.www.auth.entity.UserEntity;
import com.heaildairy.www.recommend.movie.moviedto.MovieDto;
import com.heaildairy.www.recommend.movie.movieentity.EmotionGenreMapEntity;
import com.heaildairy.www.recommend.movie.movierepository.DisLikeMoviesRepository;
import com.heaildairy.www.recommend.movie.movierepository.EmotionGenreMapRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendByInitialService {

    private final DisLikeMoviesRepository disLikeMoviesRepository;
    private final TmdbApiClientService tmdbApiClientService;
    private final EmotionGenreMapRepository emotionGenreMapRepository;

    public List<MovieDto> recommendByInitialSurvey(UserEntity user) {
        List<EmotionGenreMapEntity> genreWeights = generateGenreWeightsFromInitialSurvey(user);
        return recommendByGenreWeights(genreWeights, user);
    }

    private List<MovieDto> recommendByGenreWeights(
            List<EmotionGenreMapEntity> genreWeights, UserEntity user
    ) {
        List<Integer> disliked = disLikeMoviesRepository.findByUser_UserId(user.getUserId())
                .stream().map(e -> e.getMovieKey()).collect(Collectors.toList());

        List<MovieDto> combined = new ArrayList<>();
        for (EmotionGenreMapEntity em : genreWeights) {
            List<MovieDto> movies = tmdbApiClientService.searchMoviesByGenre(em.getGenreCode());
            combined.addAll(movies.stream()
                    .filter(m -> !disliked.contains(m.getMovieKey()))
                    .collect(Collectors.toList()));
        }

        Map<Integer, MovieDto> distinct = new LinkedHashMap<>();
        combined.forEach(m -> distinct.putIfAbsent(m.getMovieKey(), m));

        distinct.values().forEach(m ->
                m.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(m.getMovieKey()))));

        return new ArrayList<>(distinct.values());
    }

    private List<EmotionGenreMapEntity> generateGenreWeightsFromInitialSurvey(UserEntity user) {
        ObjectMapper mapper = new ObjectMapper();
        List<String> initEmo, initGenres;
        try {
            initEmo = mapper.readValue(user.getInitialEmotion(), new TypeReference<>() {});
            initGenres = mapper.readValue(user.getInitialGenre(), new TypeReference<>() {});
        } catch (Exception e) {
            log.error("설문 JSON 파싱 실패", e);
            return Collections.emptyList();
        }

        Map<Integer, EmotionGenreMapEntity> map = new HashMap<>();
        if (initEmo == null || initEmo.isEmpty()) {
            initEmo = Collections.emptyList();
        } // 현재 설문이 없어 임시로 코드 추가, 설문 구현후 코드 제거

        for (String emo : initEmo) {
            emotionGenreMapRepository.findByEmotionTypeOrdered(emo).stream()
                    .filter(e -> initGenres.contains(e.getGenreName()))
                    .forEach(e -> map.merge(
                            e.getGenreCode(),
                            new EmotionGenreMapEntity(emo, e.getGenreCode(), e.getGenreName(), e.getGenreWeight()),
                            (a, b) -> { a.setGenreWeight(a.getGenreWeight() + b.getGenreWeight()); return a; }));
        }

        return map.values().stream()
                .sorted(Comparator.comparingDouble(EmotionGenreMapEntity::getGenreWeight).reversed())
                .collect(Collectors.toList());
    }
}
