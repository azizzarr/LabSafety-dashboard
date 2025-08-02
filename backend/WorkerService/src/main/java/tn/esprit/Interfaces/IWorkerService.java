package tn.esprit.Interfaces;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tn.esprit.entities.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public interface IWorkerService {
   // Worker addWorker(Worker worker);

    Worker addWorker(Worker worker, String token);

    String extractUsernameFromToken(String token);

    void logAction(String username, String action, String message);

    Worker getWorkerById(Long id);

    List<Worker> getAllWorkers();

    List<Worker> getWorkersByTodayDate();

    List<Worker> getWorkersByLast7Days();

    List<Worker> getWorkersByExactDateTime(LocalDateTime dateTime);

    Worker updateWorker(Long id, Worker workerDetails);

    void deleteWorker(Long id);

    List<Poste> findAll();

    List<ServiceWork> findAllServices();

    List<Worker> findWorkersByPosteName(String posteName);


    List<Worker> getWorkersByPosteCMS1();

    List<Worker> getWorkersByPosteCMS2();

    List<Worker> getWorkersByPosteIntegration();

    List<Worker> getWorkersByTodayDateAndPoste(String posteName);

    List<Worker> getWorkersByLast7DaysAndPoste(String posteName);

    int countWorkersWithChargeEsdOver80();

    int countWorkersWithChargeEsdBetween40And80();

    int countWorkersWithChargeEsdUnder40();

    int countAllWorkers();

   // Map<String, Integer> countWorkersByDayInLastWeek();

    Map<String, Object> countWorkersAndAverageChargeEsdByDayInLastWeek();

    Map<String, Long> countWorkersByPostNames();

    List<Worker> getTop10WorkersByChargeEsd();

   // List<Worker> getWorkersByDate(LocalDate date);

   // List<Worker> getWorkersByDate(LocalDateTime date);

    /*  @Override
      public List<Worker> getWorkersByDate(LocalDateTime date) {
          // Query the database to find workers with the specified date
          return workerRepository.findByDate(date);
      }*/
    List<Worker> getWorkersByDate(LocalDateTime dateTime);

    List<Worker> getWorkersByDateRange(LocalDateTime start, LocalDateTime end);

    Map<String, Object> calculateStatisticsForLastWeek();

    ServiceWork addServiceWork(Enumservice name);

    Poste addPoste(Enumposte name);

    List<Worker> findWorkersByMatricule(String matricule);


    String getAverageChargeEsdByMatricule(String matricule);

    void generateAndSaveWorkers(int numberOfWorkers);

    List<AuditLog> getAllAuditLogs();

    Page<AuditLog> getFilteredAuditLogs(String action, String username, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
}
