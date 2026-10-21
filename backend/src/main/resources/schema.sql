DROP TABLE IF EXISTS source_event;
DROP TABLE IF EXISTS alarm_occurrence;

CREATE TABLE alarm_occurrence (
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 source_id VARCHAR(64) NOT NULL,
 signal_code VARCHAR(80) NOT NULL,
 device_name VARCHAR(120) NOT NULL,
 message VARCHAR(200) NOT NULL,
 severity VARCHAR(12) NOT NULL,
 raised_at TIMESTAMP NOT NULL,
 recovered_at TIMESTAMP,
 acknowledged_by VARCHAR(40),
 acknowledged_at TIMESTAMP
);

CREATE TABLE source_event (
 id BIGINT AUTO_INCREMENT PRIMARY KEY,
 source_id VARCHAR(64) NOT NULL,
 event_id VARCHAR(64) NOT NULL,
 signal_code VARCHAR(80) NOT NULL,
 event_type VARCHAR(12) NOT NULL,
 occurred_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_alarm_source_signal ON alarm_occurrence (source_id, signal_code);
CREATE INDEX idx_source_event_identity ON source_event (source_id, event_id);
