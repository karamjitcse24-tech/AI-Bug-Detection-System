package com.example.backend.controller;

import com.example.backend.model.BugReport;
import com.example.backend.service.BugReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/bugs")
@CrossOrigin(origins = "http://localhost:5173")   // <-- ADD THIS
public class BugReportController {

    @Autowired
    private BugReportService bugReportService;

    @PostMapping
    public BugReport createBug(@Valid @RequestBody BugReport bugReport) {
        return bugReportService.saveBug(bugReport);
    }

    @GetMapping
    public List<BugReport> getAllBugs() {
        return bugReportService.getAllBugs();
    }

    @PutMapping("/{id}")
    public BugReport updateBug(
            @PathVariable Long id,
            @RequestBody BugReport bugReport) {

        return bugReportService.updateBug(id, bugReport);
    }

    @DeleteMapping("/{id}")
    public String deleteBug(@PathVariable Long id) {

        bugReportService.deleteBug(id);

        return "Bug deleted successfully!";
    }
}