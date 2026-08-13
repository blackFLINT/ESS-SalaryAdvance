package com.ess.salaryadvance.advance;

import com.ess.salaryadvance.employee.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SalaryAdvanceRequestRepository extends JpaRepository<SalaryAdvanceRequest, Long> {
    List<SalaryAdvanceRequest> findByEmployeeOrderByCreatedAtDesc(Employee employee);

    List<SalaryAdvanceRequest> findByStatusOrderByCreatedAtAsc(RequestStatus status);
}
