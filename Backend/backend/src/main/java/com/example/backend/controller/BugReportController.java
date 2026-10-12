
package com.example.backend.controller;

import com.example.backend.model.BugReport;
import com.example.backend.service.BugReportService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bugs")
public class BugReportController {

    private final BugReportService bugReportService;

    public BugReportController(BugReportService bugReportService) {
        this.bugReportService = bugReportService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BugReport createBug(
            @Valid @RequestBody BugReport bugReport,
            Authentication authentication) {

        return bugReportService.saveBug(
                bugReport,
                authentication.getName()
        );
    }

    @GetMapping
    public List<BugReport> getAllBugs(
            Authentication authentication) {

        return bugReportService.getAllBugs(
                authentication.getName()
        );
    }

    @PutMapping("/{id}")
    public BugReport updateBug(
            @PathVariable Long id,
            @Valid @RequestBody BugReport bugReport,
            Authentication authentication) {

        return bugReportService.updateBug(
                id,
                bugReport,
                authentication.getName()
        );
    }

    @DeleteMapping("/{id}")
    public String deleteBug(
            @PathVariable Long id,
            Authentication authentication) {

        bugReportService.deleteBug(
                id,
                authentication.getName()
        );

        return "Bug deleted successfully!";
    }
}
