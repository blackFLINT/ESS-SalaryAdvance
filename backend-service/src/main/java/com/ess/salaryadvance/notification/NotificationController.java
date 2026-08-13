package com.ess.salaryadvance.notification;

import com.ess.salaryadvance.employee.Employee;
import com.ess.salaryadvance.employee.EmployeeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final EmployeeService employeeService;

    public NotificationController(NotificationService notificationService, EmployeeService employeeService) {
        this.notificationService = notificationService;
        this.employeeService = employeeService;
    }

    @GetMapping
    public ResponseEntity<List<NotificationDto>> list(Authentication authentication) {
        Employee employee = employeeService.getByEmail(authentication.getName());
        return ResponseEntity.ok(notificationService.listFor(employee));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> unread(Authentication authentication) {
        Employee employee = employeeService.getByEmail(authentication.getName());
        return ResponseEntity.ok(Map.of("count", notificationService.unreadFor(employee)));
    }
}