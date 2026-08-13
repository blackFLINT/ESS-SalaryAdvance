package com.ess.salaryadvance.notification;

import com.ess.salaryadvance.common.Role;
import com.ess.salaryadvance.employee.Employee;
import com.ess.salaryadvance.employee.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmployeeRepository employeeRepository;

    public NotificationService(NotificationRepository notificationRepository, EmployeeRepository employeeRepository) {
        this.notificationRepository = notificationRepository;
        this.employeeRepository = employeeRepository;
    }

    @Transactional
    public void notifyEmployee(Employee employee, String title, String message) {
        Notification notification = new Notification();
        notification.setEmployee(employee);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        notification.setCreatedAt(Instant.now());
        notificationRepository.save(notification);
    }

    @Transactional
    public void notifyRole(Role role, String title, String message) {
        employeeRepository.findAll().stream()
                .filter(employee -> employee.getRole() == role)
                .forEach(employee -> notifyEmployee(employee, title, message));
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> listFor(Employee employee) {
        return notificationRepository.findTop20ByEmployeeOrderByCreatedAtDesc(employee).stream()
                .map(NotificationDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public long unreadFor(Employee employee) {
        return notificationRepository.countByEmployeeAndReadFalse(employee);
    }
}