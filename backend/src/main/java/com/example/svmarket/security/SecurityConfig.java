package com.example.svmarket.security;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// // import org.springframework.http.HttpMethod;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

// import java.util.List;

// @Configuration
// @EnableWebSecurity
// public class SecurityConfig {

//     // @Bean
//     // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

//     // return http
//     // .cors(cors -> {
//     // })
//     // .csrf(csrf -> csrf.disable())
//     // .authorizeHttpRequests(auth -> auth
//     // .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//     // .requestMatchers("/api/auth/**").permitAll()
//     // .anyRequest().authenticated())
//     // .build();
//     // }

//     @Bean
//     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//         return http
//                 .cors(cors -> {
//                 })
//                 .csrf(csrf -> csrf.disable())
//                 .authorizeHttpRequests(auth -> auth
//                         .requestMatchers("/api/auth/**").permitAll()
//                         .requestMatchers("/api/user/**").permitAll()
//                         .requestMatchers("/uploads/**").permitAll()
//                         .requestMatchers("/images/**").permitAll()
//                         .anyRequest().authenticated())
//                 .formLogin(form -> form.disable()) // TẮT LOGIN FORM
//                 .httpBasic(basic -> basic.disable()) // TẮT BASIC AUTH
//                 .build();
//     }

//     @Bean
//     public CorsConfigurationSource corsConfigurationSource() {
//         CorsConfiguration config = new CorsConfiguration();

//         // config.setAllowedOrigins(List.of("http://localhost:5173"));
//         config.setAllowedOrigins(List.of(
//                 "http://localhost:5173",
//                 "http://localhost:5174"));
//         config.setAllowedMethods(List.of("*"));
//         config.setAllowedHeaders(List.of("*"));
//         config.setAllowCredentials(true);

//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         source.registerCorsConfiguration("/**", config);

//         return source;
//     }
// }

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // BỎ QUA security cho file tĩnh (QUAN TRỌNG NHẤT để fix 403 avatar)
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring()
                .requestMatchers("/uploads/**", "/images/**");
    }

    // CORS config (cho phép frontend gọi backend)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174"));
        config.setAllowedMethods(List.of("*"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

    // Security chính
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> {
                })
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        // AUTH
                        .requestMatchers("/api/auth/**").permitAll()

                        // USER API (tùy bạn, có thể cần login)
                        .requestMatchers("/api/user/**").permitAll()

                        // LISTING API (controller tự xử lý token)
                        .requestMatchers("/api/listings/**").permitAll()

                        // STATIC (đã ignore ở trên, nhưng để đây cũng OK)
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/images/**").permitAll()

                        // OPTIONS (fix preflight)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // còn lại phải login
                        .anyRequest().authenticated())

                // tắt login form
                .formLogin(form -> form.disable())

                // tắt basic auth
                .httpBasic(basic -> basic.disable())

                .build();
    }
}