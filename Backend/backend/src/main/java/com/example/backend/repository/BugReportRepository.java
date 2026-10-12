
package com.example.backend.repository;

import com.example.backend.model.BugReport;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BugReportRepository
        extends JpaRepository<BugReport, Long> {

    List<BugReport> findAllByOwner(User owner);

    Optional<BugReport> findByIdAndOwner(
            Long id,
            User owner
    );
}
