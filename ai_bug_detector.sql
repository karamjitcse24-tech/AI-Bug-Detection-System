DESCRIBE bug_reports;
USE ai_bug_detector;

ALTER TABLE bug_reports
MODIFY COLUMN ai_reason TEXT,
MODIFY COLUMN ai_recommendation TEXT;
SELECT
    id,
    title,
    severity,
    ai_reason,
    ai_recommendation
FROM bug_reports
ORDER BY id DESC;
CREATE DATABASE IF NOT EXISTS ai_bug_detector;

USE ai_bug_detector;

CREATE TABLE IF NOT EXISTS bug_reports (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255),
    description VARCHAR(255),
    severity VARCHAR(255),
    status VARCHAR(255),
    ai_reason VARCHAR(255),
    ai_recommendation VARCHAR(255),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id)
);
