package com.fitness.activity_service.service;

import com.fitness.activity_service.dto.ActivityRequest;
import com.fitness.activity_service.dto.ActivityResponse;
import com.fitness.activity_service.model.Activity;
import com.fitness.activity_service.repository.ActivityRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final RabbitTemplate rabbitTemplate;
    private final WebClient aiServiceWebClient;

    @Value("${rabbitmq.exchange.name}")
    private String exchange;

    @Value("${rabbitmq.routing.key}")
    private String routingKey;


    @PostConstruct
    public void testRabbitConfig() {
        log.info("RabbitMQ exchange = {}", exchange);
        log.info("RabbitMQ routing key = {}", routingKey);
    }

    public ActivityResponse trackActivity(ActivityRequest request){

        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        if(!isValidUser){
            throw new RuntimeException("Invalid user id" + request.getUserId());
        }

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        Activity savedActivity = activityRepository.save(activity);

        // Publish to RabbitMQ for AI Processing
        rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);

        log.info(
                "Successfully published activity to RabbitMQ: exchange={}, routingKey={}",
                exchange,
                routingKey
        );

        return mapToResponse(savedActivity);

    }


    private ActivityResponse mapToResponse(Activity activity){

        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        List<Activity> activities = activityRepository.findByUserId(userId);
        return activities.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
        return activityRepository.findById(activityId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found with id: " + activityId));
    }


    public void deleteActivity(String activityId) {

        if (!activityRepository.existsById(activityId)) {
            throw new RuntimeException("Activity not found");
        }

        // Delete activity from activity database
        activityRepository.deleteById(activityId);

        // Delete related recommendation from AI service
        try {
            aiServiceWebClient
                    .delete()
                    .uri("/api/recommendations/activity/{activityId}", activityId)
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            log.info(
                    "Successfully deleted recommendation for activity: {}",
                    activityId
            );

        } catch (Exception e) {

            log.error(
                    "Failed to delete recommendation for activity: {}",
                    activityId,
                    e
            );
        }
    }
}
