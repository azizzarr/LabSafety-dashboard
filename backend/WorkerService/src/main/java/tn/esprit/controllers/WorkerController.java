package tn.esprit.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;
import tn.esprit.Interfaces.IUserService;
import tn.esprit.Interfaces.IWorkerService;
import tn.esprit.entities.*;
import tn.esprit.repositories.UserRepository;
import tn.esprit.security.jwtUtils.JwtUtils;
import tn.esprit.services.PredictionService;

import javax.persistence.EntityNotFoundException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/workers")

public class WorkerController {

    @Autowired
    IWorkerService workerService;
    @Autowired
    private PredictionService predictionService;




    private static final Logger logger = LoggerFactory.getLogger(WorkerController.class);
   /* @PostMapping("/add")
    public ResponseEntity<Worker> addWorker(@RequestBody Worker worker) {
        Worker addedWorker = workerService.addWorker(worker);
        return new ResponseEntity<>(addedWorker, HttpStatus.CREATED);
    }*/
   @PostMapping("/add")
   public ResponseEntity<Worker> addWorker(@RequestHeader("Authorization") String token, @RequestBody Worker worker) {
       try {
           Worker addedWorker = workerService.addWorker(worker, token);
           return new ResponseEntity<>(addedWorker, HttpStatus.CREATED);
       } catch (Exception e) {
           Logger logger = LoggerFactory.getLogger(WorkerController.class);
           logger.error("An error occurred while adding worker", e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
       }
   }
/*
    private String extractUsernameFromToken(String token) {
        try {
            if (token == null || token.isEmpty()) {
                throw new IllegalArgumentException("Token is null or empty");
            }

            String[] tokenParts = token.split(" ");
            if (tokenParts.length != 2) {
                throw new IllegalArgumentException("Invalid token format");
            }

            String jwtToken = tokenParts[1].trim();
            String username = jwtUtils.getUsernameFromToken(jwtToken);

            User currentUser = userRepository.findByUserName(username).orElseThrow(() ->
                    new EntityNotFoundException("User not found")
            );

            return currentUser.getUserName();
        } catch (Exception e) {
            logger.error("Error extracting username from token", e);
            throw new RuntimeException("Error extracting username from token", e);
        }
    }

    private void logAction(String username, String action, String message) {
        logger.info("User: {}, Action: {}, Message: {}", username, action, message);
    }*/
    @GetMapping("/{id}")
    public ResponseEntity<Worker> getWorkerById(@PathVariable Long id) {
        Worker worker = workerService.getWorkerById(id);
        if (worker != null) {
            return new ResponseEntity<>(worker, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Worker>> getAllWorkers() {
        List<Worker> workers = workerService.getAllWorkers();
        return new ResponseEntity<>(workers, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Worker> updateWorker(@PathVariable Long id, @RequestBody Worker workerDetails) {
        Worker updatedWorker = workerService.updateWorker(id, workerDetails);
        if (updatedWorker != null) {
            return new ResponseEntity<>(updatedWorker, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorker(@PathVariable Long id) {
        workerService.deleteWorker(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping("/getPoste")
    @ResponseBody
    public List<Poste> findAll() {
        return workerService.findAll();
    }

    @GetMapping("/getService")
    @ResponseBody
    public List<ServiceWork> findAllService() {
        return workerService.findAllServices();
    }
    @GetMapping("/poste/CMS1")
    @ResponseBody
    public ResponseEntity<List<Worker>> getWorkersByPosteCMS1() {
        List<Worker> workers = workerService.getWorkersByPosteCMS1();
        if (workers.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no workers found
        }
        return ResponseEntity.ok(workers); // Return 200 OK with the list of workers
    }
    @GetMapping("/poste/CMS2")
    @ResponseBody
    public ResponseEntity<List<Worker>> getWorkersByPosteCMS2() {
        List<Worker> workers = workerService.getWorkersByPosteCMS2();
        if (workers.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no workers found
        }
        return ResponseEntity.ok(workers); // Return 200 OK with the list of workers
    }
    @GetMapping("/poste/Integration")
    @ResponseBody
    public ResponseEntity<List<Worker>> getWorkersByPosteIntegration() {
        List<Worker> workers = workerService.getWorkersByPosteIntegration();
        if (workers.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no workers found
        }
        return ResponseEntity.ok(workers); // Return 200 OK with the list of workers
    }
    @GetMapping("/count-workers-charge-esd-over-80")
    public ResponseEntity<Integer> countWorkersWithChargeEsdOver80() {
        int count = workerService.countWorkersWithChargeEsdOver80();
        return ResponseEntity.ok(count);
    }
    @GetMapping("/count-workers-charge-esd-between-40-and-80")
    public ResponseEntity<Integer> countWorkersWithChargeEsdBetween40And80() {
        int count = workerService.countWorkersWithChargeEsdBetween40And80();
        return ResponseEntity.ok(count);
    }
    @GetMapping("/count-workers-charge-esd-under-40")
    public ResponseEntity<Integer> countWorkersWithChargeEsdUnder40() {
        int count = workerService.countWorkersWithChargeEsdUnder40();
        return ResponseEntity.ok(count);
    }
    @GetMapping("/count-all-workers")
    public ResponseEntity<Integer> countAllWorkers() {
        int count = workerService. countAllWorkers();
        return ResponseEntity.ok(count);
    }
    @GetMapping("/stats/last-week")
    public ResponseEntity<Map<String, Object>> getWorkersAndAverageChargeEsdByDayInLastWeek() {
        Map<String, Object> workersAndAverageChargeEsdByDay = workerService.countWorkersAndAverageChargeEsdByDayInLastWeek();
        return new ResponseEntity<>(workersAndAverageChargeEsdByDay, HttpStatus.OK);
    }
    @GetMapping("/count_by_postes")
    public Map<String, Long> countWorkersByPostNames() {
        return workerService.countWorkersByPostNames();
    }

    @GetMapping("/top10ByChargeEsd")
    public List<Worker> getTop10WorkersByChargeEsd() {
        return workerService.getTop10WorkersByChargeEsd();
    }

    // Endpoint to handle date-only input
    @GetMapping("/by-date/{date}")
    public List<Worker> getWorkersByDate(@PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String dateString) {
        // Trim the input string to remove any leading/trailing whitespace or newline characters
        String trimmedDateString = dateString.trim();

        // Parse the trimmed string to LocalDate
        LocalDate date = LocalDate.parse(trimmedDateString);

        // Convert LocalDate to the start and end of the day
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);

        // Call the service method to get workers for the specified date range
        return workerService.getWorkersByDateRange(startOfDay, endOfDay);
    }

    // Endpoint to handle date-time input
    @GetMapping("/by-datee/{dateTime}")
    public List<Worker> getWorkersByDateTime(@PathVariable("dateTime") @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime dateTime) {
        // Trim the LocalDateTime to remove the 'T' and format it to the desired format
        String formattedDateTime = dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        // Log the formatted date-time for debugging
        System.out.println("Formatted LocalDateTime: " + formattedDateTime);

        // Call the service method to get workers for the specified date-time
        return workerService.getWorkersByDate(LocalDateTime.parse(formattedDateTime, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }


    @GetMapping("/byDateTime/{dateTime}")
    public ResponseEntity<List<Worker>> getWorkersByExactDateTime(@PathVariable String dateTime) {
        try {
            LocalDateTime parsedDateTime = LocalDateTime.parse(dateTime);
            List<Worker> workers = workerService.getWorkersByExactDateTime(parsedDateTime);
            return ResponseEntity.ok().body(workers);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }





    @GetMapping("/statistics/forlastweek_average")
    public ResponseEntity<Map<String, Object>> getStatisticsForLastWeek() {
        Map<String, Object> statistics = workerService.calculateStatisticsForLastWeek();
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/addPoste")
    public ResponseEntity<Poste> addPoste(@RequestBody Poste posteRequest) {
        try {
            Poste newPoste = workerService.addPoste(posteRequest.getName());
            return new ResponseEntity<>(newPoste, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
    }
    @GetMapping("/today")
    public ResponseEntity<List<Worker>> getWorkersWithTodayDate() {
        List<Worker> workers = workerService.getWorkersByTodayDate();
        return ResponseEntity.ok(workers);
    }
    @GetMapping("/todayPoste/{posteName}")
    public ResponseEntity<List<Worker>> getWorkersByTodayDateAndPoste(@PathVariable String posteName) {
        List<Worker> workers = workerService.getWorkersByTodayDateAndPoste(posteName);
        return ResponseEntity.ok(workers);
    }
    @GetMapping("/last7days")
    public ResponseEntity<List<Worker>> getWorkersByLast7Days() {
        List<Worker> workers = workerService.getWorkersByLast7Days();
        if (workers.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no workers found
        }
        return new ResponseEntity<>(workers, HttpStatus.OK);// Return 200 OK with the list of workers
    }

    @GetMapping("/last7days/{posteName}")
    public ResponseEntity<List<Worker>> getWorkersByLast7DaysAndPoste(@PathVariable String posteName) {
        List<Worker> workers = workerService.getWorkersByLast7DaysAndPoste(posteName);
        if (workers.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 No Content if no workers found
        }
        return ResponseEntity.ok(workers); // Return 200 OK with the list of workers
    }
    @GetMapping("/matricule/{matricule}")
    public List<Worker> getWorkersByMatricule(@PathVariable String matricule) {
        return workerService.findWorkersByMatricule(matricule);
    }
    @GetMapping("/average-charge/{matricule}")
    public ResponseEntity<String> getAverageChargeEsdByMatricule(@PathVariable String matricule) {
        String averageChargeEsd = workerService.getAverageChargeEsdByMatricule(matricule);
        return ResponseEntity.ok(averageChargeEsd);
    }


    @GetMapping("/prediction")
    public List<Map<String, Object>> getPrediction() {
        return predictionService.getPrediction();
    }

    @GetMapping("/dash")
    public RedirectView redirectToDash() {
        String dashUrl = predictionService.getDashPageUrl();
        return new RedirectView(dashUrl);
    }

    @GetMapping("/generate-workers")
    public String generateWorkers() {
        int count = 200; // Set to 4000 workers
        workerService.generateAndSaveWorkers(count);
        return count + " workers generated and saved.";
    }
    @GetMapping("/usernamee")
    public ResponseEntity<String> getUsernameFromToken(@RequestHeader("Authorization") String token) {
        try {
            // Extract username from token using the workerService
            String username = workerService.extractUsernameFromToken(token);
            return ResponseEntity.ok(username);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token: " + e.getMessage());
        }
    }
    @GetMapping("/allLogs")
    public ResponseEntity<List<AuditLog>>getAllAuditLogs() {
      List <AuditLog> auditlogs= workerService.getAllAuditLogs();
        return new ResponseEntity<>(auditlogs, HttpStatus.OK);
    }
    @GetMapping("/filteredlogs")
    public ResponseEntity<Page<AuditLog>> getFilteredAuditLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        Page<AuditLog> filteredLogs = workerService.getFilteredAuditLogs(action, username, startDate, endDate, pageable);
        return ResponseEntity.ok(filteredLogs);
    }

}
