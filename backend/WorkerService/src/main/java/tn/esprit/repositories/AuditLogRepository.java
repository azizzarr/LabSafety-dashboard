package tn.esprit.repositories;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.entities.Alert;
import tn.esprit.entities.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    @Query("SELECT a FROM AuditLog a WHERE "
            + "(:action IS NULL OR a.action = :action) AND "
            + "(:username IS NULL OR a.username = :username) AND "
            + "(:startDate IS NULL OR a.timestamp >= :startDate) AND "
            + "(:endDate IS NULL OR a.timestamp <= :endDate)")
    Page<AuditLog> findByCriteria(@Param("action") String action,
                                  @Param("username") String username,
                                  @Param("startDate") LocalDateTime startDate,
                                  @Param("endDate") LocalDateTime endDate,
                                  Pageable pageable);

   // List<AuditLog> findAll(Sort sort);
   List<AuditLog> findAllByOrderByTimestampDesc();
}
