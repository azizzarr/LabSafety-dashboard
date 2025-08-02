package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.entities.Enumposte;
import tn.esprit.entities.User;
import tn.esprit.entities.Worker;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
    List<Worker> findWorkersByPostes_Name(String posteName);


    List<Worker> findByPostes_Name(Enumposte posteName);
    int countByChargeEsdGreaterThan(Long chargeEsd);
    int countByChargeEsdBetween(Long minChargeEsd, Long maxChargeEsd);
    int countByChargeEsdLessThan(Long chargeEsd);
    @Query("SELECT COUNT(w) FROM Worker w WHERE w.date = :date")
    int countByDate(LocalDateTime date);
    int countByDate(LocalDate date);
    @Query("SELECT w FROM Worker w WHERE w.date = :dateTime")
    List<Worker> findByDate(LocalDateTime dateTime);

    @Query("SELECT w FROM Worker w WHERE w.date >= :start AND w.date <= :end")
    List<Worker> findByDateRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    long countByPostesName(Enumposte name);
    List<Worker> findTop10ByOrderByChargeEsdDesc();
    long countByDateAndChargeEsdLessThan(LocalDateTime date, Long chargeEsd);

    long countByDateAndChargeEsdBetween(LocalDateTime date, Long start, Long end);

    long countByDateAndChargeEsdGreaterThan(LocalDateTime date, Long chargeEsd);

    @Query("SELECT COUNT(w) FROM Worker w WHERE DATE(w.date) BETWEEN :startDate AND :endDate")
    long countByDateBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


    List<Worker> findByDateBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);



    List<Worker> findByDateBetweenAndPostes_Name(LocalDateTime startOfDay, LocalDateTime endOfDay, Enumposte posteName);

    List<Worker> findByMatricule(String matricule);
    // List<Worker> findAllByDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}
