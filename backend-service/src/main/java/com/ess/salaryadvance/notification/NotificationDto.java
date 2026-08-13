package com.ess.salaryadvance.notification;

import java.time.Instant;

public class NotificationDto {
    private Long id;
    private String title;
    private String message;
    private Boolean read;
    private Instant createdAt;

    public static NotificationDto from(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.id = notification.getId();
        dto.title = notification.getTitle();
        dto.message = notification.getMessage();
        dto.read = notification.getRead();
        dto.createdAt = notification.getCreatedAt();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getMessage() {
        return message;
    }

    public Boolean getRead() {
        return read;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}