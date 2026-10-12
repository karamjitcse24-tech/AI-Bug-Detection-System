
package com.example.backend.service;

import com.example.backend.model.BugReport;
import com.example.backend.model.User;
import com.example.backend.repository.BugReportRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class BugReportService {

    private final BugReportRepository bugReportRepository;
    private final UserRepository userRepository;

    public BugReportService(
            BugReportRepository bugReportRepository,
            UserRepository userRepository) {
        this.bugReportRepository = bugReportRepository;
        this.userRepository = userRepository;
    }

    private User getUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Authenticated user not found"
                ));
    }

    private BugReport getOwnedBug(Long id, User owner) {
        return bugReportRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Bug report not found"
                ));
    }

    // Create a bug for the authenticated user
    @Transactional
    public BugReport saveBug(BugReport bugReport, String email) {
        User owner = getUser(email);

        // Never trust an owner supplied by the frontend.
        bugReport.setId(null);
        bugReport.setOwner(owner);

        return bugReportRepository.save(bugReport);
    }

    // Get only this user's bugs
    @Transactional(readOnly = true)
    public List<BugReport> getAllBugs(String email) {
        User owner = getUser(email);
        return bugReportRepository.findAllByOwner(owner);
    }

    // Update only a bug owned by this user
    @Transactional
    public BugReport updateBug(
            Long id,
            BugReport updatedBug,
            String email) {

        User owner = getUser(email);
        BugReport existingBug = getOwnedBug(id, owner);

        existingBug.setTitle(updatedBug.getTitle());
        existingBug.setDescription(updatedBug.getDescription());
        existingBug.setSeverity(updatedBug.getSeverity());
        existingBug.setStatus(updatedBug.getStatus());

        // Preserve AI analysis fields.
        existingBug.setAiReason(updatedBug.getAiReason());
        existingBug.setAiRecommendation(
                updatedBug.getAiRecommendation()
        );

        // Keep the original ID, owner, and creation timestamp.
        return bugReportRepository.save(existingBug);
    }

    // Delete only a bug owned by this user
    @Transactional
    public void deleteBug(Long id, String email) {
        User owner = getUser(email);
        BugReport existingBug = getOwnedBug(id, owner);

        bugReportRepository.delete(existingBug);
    }
}
