package com.ess.salaryadvance.auth;

import com.ess.salaryadvance.config.JwtService;
import com.ess.salaryadvance.employee.Employee;
import com.ess.salaryadvance.employee.EmployeeRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final EmployeeRepository employeeRepository;
    private final JwtService jwtService;

    public AuthService(AuthenticationManager authenticationManager,
            EmployeeRepository employeeRepository,
            JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.employeeRepository = employeeRepository;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        Employee employee = employeeRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        User user = (User) User.withUsername(employee.getEmail())
                .password(employee.getPasswordHash())
                .roles(employee.getRole().name())
                .build();

        String token = jwtService.generateToken(user);
        return new LoginResponse(token, employee.getRole().name(), employee.getFullName(), employee.getEmail());
    }
}
