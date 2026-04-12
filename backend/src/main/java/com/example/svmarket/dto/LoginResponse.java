package com.example.svmarket.dto;

public class LoginResponse {
    private String token;
    private String message;
    private String fullName;
    private String avatar;

    public LoginResponse() {
    }

    public LoginResponse(String token, String message, String fullName, String avatar) {
        this.token = token;
        this.message = message;
        this.fullName = fullName;
        this.avatar = avatar;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }
}