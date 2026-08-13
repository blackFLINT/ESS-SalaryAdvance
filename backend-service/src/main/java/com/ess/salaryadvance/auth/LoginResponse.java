package com.ess.salaryadvance.auth;

import java.util.List;

public class LoginResponse {
    private String token;
    private String refreshToken;
    private String role;
    private String fullName;
    private String email;
    private List<String> features;

    public LoginResponse(String token, String refreshToken, String role, String fullName, String email,
            List<String> features) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
        this.features = features;
    }

    public String getToken() {
        return token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public String getRole() {
        return role;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public List<String> getFeatures() {
        return features;
    }
}
