package com.ess.salaryadvance.auth;

import com.ess.salaryadvance.audit.AuditService;
import com.ess.salaryadvance.common.BusinessException;
import com.ess.salaryadvance.config.JwtService;
import com.ess.salaryadvance.employee.Employee;
import com.ess.salaryadvance.employee.EmployeeRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Comparator;
import java.util.UUID;

@Service
public class AuthService {

        private final AuthenticationManager authenticationManager;
        private final EmployeeRepository employeeRepository;
        private final JwtService jwtService;
        private final RefreshTokenRepository refreshTokenRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuditService auditService;

        public AuthService(AuthenticationManager authenticationManager,
                        EmployeeRepository employeeRepository,
                        JwtService jwtService,
                        RefreshTokenRepository refreshTokenRepository,
                        PasswordEncoder passwordEncoder,
                        AuditService auditService) {
                this.authenticationManager = authenticationManager;
                this.employeeRepository = employeeRepository;
                this.jwtService = jwtService;
                this.refreshTokenRepository = refreshTokenRepository;
                this.passwordEncoder = passwordEncoder;
                this.auditService = auditService;
        }

        @Transactional
        public LoginResponse login(LoginRequest request) {
                Employee employee = employeeRepository.findByEmailIgnoreCase(request.getEmail())
                                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

                if (Boolean.TRUE.equals(employee.getAccountLocked()) && employee.getLockedUntil() != null
                                && employee.getLockedUntil().isAfter(Instant.now())) {
                        throw new BusinessException("Account is temporarily locked. Try again later.");
                }

                try {
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(request.getEmail(),
                                                        request.getPassword()));
                } catch (BadCredentialsException ex) {
                        int attempts = employee.getFailedLoginAttempts() == null ? 1
                                        : employee.getFailedLoginAttempts() + 1;
                        employee.setFailedLoginAttempts(attempts);
                        if (attempts >= 5) {
                                employee.setAccountLocked(true);
                                employee.setLockedUntil(Instant.now().plus(Duration.ofMinutes(15)));
                                auditService.record("ACCOUNT_LOCKED", employee.getId(), "EMPLOYEE",
                                                "Account locked after failed login attempts", employee.getEmail());
                        }
                        employeeRepository.save(employee);
                        throw ex;
                }

                employee.setFailedLoginAttempts(0);
                employee.setAccountLocked(false);
                employee.setLockedUntil(null);
                employeeRepository.save(employee);

                User user = (User) User.withUsername(employee.getEmail())
                                .password(employee.getPasswordHash())
                                .roles(employee.getRole().name())
                                .build();

                String token = jwtService.generateToken(user);
                String refreshToken = createRefreshToken(employee).getToken();
                return new LoginResponse(
                                token,
                                refreshToken,
                                employee.getRole().name(),
                                employee.getFullName(),
                                employee.getEmail(),
                                employee.getFeatures().stream().map(Enum::name).sorted(Comparator.naturalOrder())
                                                .toList());
        }

        @Transactional
        public LoginResponse refresh(RefreshTokenRequest request) {
                RefreshToken refreshToken = refreshTokenRepository.findByTokenAndRevokedFalse(request.getRefreshToken())
                                .orElseThrow(() -> new BusinessException("Invalid refresh token"));
                if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
                        refreshToken.setRevoked(true);
                        throw new BusinessException("Refresh token expired");
                }
                refreshToken.setRevoked(true);
                Employee employee = refreshToken.getEmployee();
                User user = (User) User.withUsername(employee.getEmail())
                                .password(employee.getPasswordHash())
                                .roles(employee.getRole().name())
                                .build();
                return new LoginResponse(jwtService.generateToken(user), createRefreshToken(employee).getToken(),
                                employee.getRole().name(), employee.getFullName(), employee.getEmail(),
                                employee.getFeatures().stream().map(Enum::name).sorted(Comparator.naturalOrder())
                                                .toList());
        }

        @Transactional
        public void changePassword(String email, ChangePasswordRequest request) {
                Employee employee = employeeRepository.findByEmailIgnoreCase(email)
                                .orElseThrow(() -> new BusinessException("User not found"));
                if (!passwordEncoder.matches(request.getCurrentPassword(), employee.getPasswordHash())) {
                        throw new BusinessException("Current password is incorrect");
                }
                employee.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
                employee.setPasswordChangedAt(Instant.now());
                employeeRepository.save(employee);
                auditService.record("PASSWORD_CHANGED", employee.getId(), "EMPLOYEE", "Password changed", email);
        }

        private RefreshToken createRefreshToken(Employee employee) {
                RefreshToken refreshToken = new RefreshToken();
                refreshToken.setEmployee(employee);
                refreshToken.setToken(UUID.randomUUID().toString());
                refreshToken.setExpiresAt(Instant.now().plus(Duration.ofDays(7)));
                refreshToken.setRevoked(false);
                return refreshTokenRepository.save(refreshToken);
        }
}
