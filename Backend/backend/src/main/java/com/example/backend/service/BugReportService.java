package com.example.backend.service;

import com.example.backend.model.BugReport;
import com.example.backend.repository.BugReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BugReportService {

    @Autowired
    private BugReportRepository bugReportRepository;

    // Create bug
    public BugReport saveBug(BugReport bugReport) {
        return bugReportRepository.save(bugReport);
    }

    // Get all bugs
    public List<BugReport> getAllBugs() {
        return bugReportRepository.findAll();
    }

    // Update bug
    public BugReport updateBug(Long id, BugReport updatedBug) {

        BugReport existingBug = bugReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bug not found"));

        existingBug.setTitle(updatedBug.getTitle());
        existingBug.setDescription(updatedBug.getDescription());
        existingBug.setSeverity(updatedBug.getSeverity());
        existingBug.setStatus(updatedBug.getStatus());

        // 🤖 Update AI Analysis
        existingBug.setAiReason(updatedBug.getAiReason());
        existingBug.setAiRecommendation(updatedBug.getAiRecommendation());

        return bugReportRepository.save(existingBug);
    }

    // Delete bug
    public void deleteBug(Long id) {

        if (!bugReportRepository.existsById(id)) {
            throw new RuntimeException("Bug not found");
        }

        bugReportRepository.deleteById(id);
    }
}