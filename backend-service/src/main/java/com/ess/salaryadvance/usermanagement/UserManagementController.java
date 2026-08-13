package com.ess.salaryadvance.usermanagement;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserManagementController {

    private final UserManagementService userManagementService;

    public UserManagementController(UserManagementService userManagementService) {
        this.userManagementService = userManagementService;
    }

    @GetMapping
    public ResponseEntity<List<UserManagementResponse>> listUsers() {
        return ResponseEntity.ok(userManagementService.listUsers());
    }

    @GetMapping("/features")
    public ResponseEntity<List<String>> listFeatures() {
        return ResponseEntity.ok(userManagementService.listFeatures());
    }

    @PostMapping
    public ResponseEntity<UserManagementResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        return ResponseEntity.ok(userManagementService.createUser(request));
    }

    @PatchMapping("/{userId}/access")
    public ResponseEntity<UserManagementResponse> updateAccess(@PathVariable Long userId,
            @Valid @RequestBody UpdateUserAccessRequest request) {
        return ResponseEntity.ok(userManagementService.updateAccess(userId, request));
    }
}
