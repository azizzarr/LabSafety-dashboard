package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.entities.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
}
