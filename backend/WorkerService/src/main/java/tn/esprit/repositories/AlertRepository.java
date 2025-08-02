package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tn.esprit.entities.Alert;

import java.time.LocalDateTime;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findAllByOrderByTimestampDesc();
    @Query("SELECT a FROM Alert a WHERE a.timestamp >= :startOfDay AND a.timestamp <= :endOfDay ORDER BY a.timestamp DESC")
    List<Alert> findAllByToday(LocalDateTime startOfDay, LocalDateTime endOfDay);

    @Query("SELECT a FROM Alert a WHERE a.timestamp >= :startOfWeek AND a.timestamp <= :endOfDay ORDER BY a.timestamp DESC")
    List<Alert> findAllByLastWeek(LocalDateTime startOfWeek, LocalDateTime endOfDay);

    @Query("SELECT a FROM Alert a WHERE a.timestamp >= :startOfMonth AND a.timestamp <= :endOfDay ORDER BY a.timestamp DESC")
    List<Alert> findAllByLastMonth(LocalDateTime startOfMonth, LocalDateTime endOfDay);
}

