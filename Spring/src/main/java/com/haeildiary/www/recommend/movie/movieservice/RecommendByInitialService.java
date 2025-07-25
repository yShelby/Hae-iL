package com.haeildiary.www.recommend.movie.movieservice;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.haeildiary.www.auth.entity.UserEntity;
import com.haeildiary.www.mood.dto.MoodDetailDTO;
import com.haeildiary.www.recommend.movie.moviedto.MovieDto;
import com.haeildiary.www.recommend.movie.movieentity.EmotionGenreMapEntity;
import com.haeildiary.www.recommend.movie.movierepository.DisLikeMoviesRepository;
import com.haeildiary.www.recommend.movie.movierepository.EmotionGenreMapRepository;
import com.haeildiary.www.recommend.movie.movieresponse.MovieListResponse;
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

    public MovieListResponse recommendByInitialSurvey(UserEntity user) {
        Map<String, List<String>> initiaData = parseInitial(user);

        List<String> initEmo = initiaData.get("emotions");
        List<String> initGenres = initiaData.get("genres");

        log.info("최종 감정확인 :{}", initEmo);
        log.info("최종 장르확인 :{}", initGenres);

        List<EmotionGenreMapEntity> genreWeights = generateGenreWeightsFromInitialSurvey(initEmo, initGenres);
        List<MovieDto> combinedResults = recommendByGenreWeights(genreWeights, user)
                .stream()
                .limit(10)
                .collect(Collectors.toList());

        Map<String, List<MovieDto>> resultsByEmotion = new HashMap<>();

        for (String emotion : initEmo) {
            List<EmotionGenreMapEntity> weightsForEmotion = emotionGenreMapRepository.findByEmotionTypeOrdered(emotion).stream()
                    .filter(e -> initGenres.contains(e.getGenreName()))
                    .collect(Collectors.toList());

            List<MovieDto> recommendedMovies = recommendByGenreWeights(weightsForEmotion, user)
                    .stream()
                    .limit(10)
                    .collect(Collectors.toList());

            resultsByEmotion.put(emotion, recommendedMovies);
        }

        fillMovieDetails(combinedResults);
        resultsByEmotion.values().forEach(this::fillMovieDetails);

        log.info("가중치 확인 :{}", genreWeights);
        log.info("감정별 확인 :{}", resultsByEmotion);
        log.info("종합 확인 :{}", combinedResults);

        List<MoodDetailDTO> moodDetails = initEmo.stream()
                .map(emoStr -> {
                    MoodDetailDTO dto = new MoodDetailDTO();
                    dto.setMoodType(emoStr);
                    return dto;
                }).collect(Collectors.toList());

        return new MovieListResponse(combinedResults, resultsByEmotion, moodDetails, false);
    }

    private void fillMovieDetails(List<MovieDto> movies) {
        movies.forEach(movie -> {
            String movieKey = movie.getMovieKey().toString();
            MovieDto detailed = tmdbApiClientService.getMovieCreditsWithDetails(movieKey);
            movie.setCastNames(detailed.getCastNames());
            movie.setDirectorName(detailed.getDirectorName());
            if (movie.getTrailerUrl() == null || movie.getTrailerUrl().isEmpty()) {
                movie.setTrailerUrl(tmdbApiClientService.getMovieTrailer(movieKey));
            }
        });
    }

    private List<MovieDto> recommendByGenreWeights(
            List<EmotionGenreMapEntity> genreWeights, UserEntity user
    ) {
        List<Integer> disliked = disLikeMoviesRepository.findByUser_UserId(user.getUserId())
                .stream().map(e -> e.getMovieKey()).collect(Collectors.toList());
        log.info("싫어요 목록 : {}", disliked);
        List<MovieDto> combined = new ArrayList<>();
        for (EmotionGenreMapEntity em : genreWeights) {
            List<MovieDto> movies = tmdbApiClientService.searchMoviesByGenre(em.getGenreCode());
            combined.addAll(movies.stream()
                    .filter(m -> !disliked.contains(m.getMovieKey()))
                    .filter(m -> !m.isAdult())
                    .collect(Collectors.toList()));
        }

        Map<Integer, MovieDto> distinct = new LinkedHashMap<>();
        combined.forEach(m -> distinct.putIfAbsent(m.getMovieKey(), m));

        distinct.values().forEach(m ->
                m.setTrailerUrl(tmdbApiClientService.getMovieTrailer(String.valueOf(m.getMovieKey()))));

        return new ArrayList<>(distinct.values());
    }

    private Map<String, List<String>> parseInitial(UserEntity user) {
        ObjectMapper mapper = new ObjectMapper();
        Map<String, List<String>> initResult = new HashMap<>();
        try {
            List<String> initEmo = mapper.readValue(user.getInitialEmotion(), new TypeReference<List<String>>() {});
            List<String> initGenres = mapper.readValue(user.getInitialGenre(), new TypeReference<List<String>>() {});
            initResult.put("emotions", initEmo);
            initResult.put("genres", initGenres);
        } catch (Exception e) {
            log.error("설문 JSON 파싱 실패", e);
            initResult.put("emotions", Collections.emptyList());
            initResult.put("genres", Collections.emptyList());
        }
        return initResult;
    }

    private List<EmotionGenreMapEntity> generateGenreWeightsFromInitialSurvey(List<String> initEmo, List<String> initGenres) {

        Map<Integer, EmotionGenreMapEntity> map = new HashMap<>();

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
