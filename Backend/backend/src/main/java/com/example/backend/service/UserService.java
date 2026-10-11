
package com.example.backend.service;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerUser(
            String name,
            String email,
            String rawPassword) {

        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(
                    "Name is required.");
        }

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "Email is required.");
        }

        if (rawPassword == null
                || rawPassword.length() < 8
                || rawPassword.length() > 72) {

            throw new IllegalArgumentException(
                    "Password must contain between 8 and 72 characters.");
        }

        String normalizedEmail =
                email.trim().toLowerCase(java.util.Locale.ROOT);

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException(
                    "An account with this email already exists.");
        }

        User user = new User();
        user.setName(name.trim());
        user.setEmail(normalizedEmail);

        // Store only the BCrypt hash, never the raw password.
        user.setPassword(passwordEncoder.encode(rawPassword));

        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User loginUser(String email, String rawPassword) {

        if (email == null || email.isBlank()
                || rawPassword == null || rawPassword.isEmpty()) {

            throw new IllegalArgumentException(
                    "Invalid email or password.");
        }

        String normalizedEmail =
                email.trim().toLowerCase(java.util.Locale.ROOT);

        User user = userRepository
                .findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid email or password."));

        // Compare the submitted password with its stored BCrypt hash.
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException(
                    "Invalid email or password.");
        }

        return user;
    }
}
