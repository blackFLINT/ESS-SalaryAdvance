package com.ess.salaryadvance.usermanagement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public class UpdateUserAccessRequest {

    @NotBlank(message = "Role is required")
    private String role;

    @NotEmpty(message = "At least one feature is required")
    private Set<String> features;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Set<String> getFeatures() {
        return features;
    }

    public void setFeatures(Set<String> features) {
        this.features = features;
    }
}
