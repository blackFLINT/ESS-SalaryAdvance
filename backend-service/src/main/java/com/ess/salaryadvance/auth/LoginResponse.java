package com.ess.salaryadvance.auth;

public class LoginResponse {
    private String token;
    private String role;
    private String fullName;
    private String email;

    public LoginResponse(String token, String role, String fullName, String email) {
        this.token = token;
        this.role = role;
        this.fullName = fullName;
        this.email = email;
    }

    public String getToken() {
        return token;
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
}
