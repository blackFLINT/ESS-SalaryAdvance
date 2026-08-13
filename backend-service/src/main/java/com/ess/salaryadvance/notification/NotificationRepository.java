package com.ess.salaryadvance.notification;

import com.ess.salaryadvance.employee.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findTop20ByEmployeeOrderByCreatedAtDesc(Employee employee);

    long countByEmployeeAndReadFalse(Employee employee);
}