package tn.esprit.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.IWorkerService;
import tn.esprit.entities.*;
import tn.esprit.repositories.*;
import tn.esprit.security.jwtUtils.JwtUtils;

import javax.persistence.EntityNotFoundException;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class WorkerServiceImpl implements IWorkerService {

    @Autowired
    private WorkerRepository workerRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private PosteRepository posteRepository;

    @Autowired
    private UserRepository userRepository; // Inject your UserService here

    @Autowired
    private JavaMailSender javaMailSender;

   @Autowired
   private EmailService emailService;
    @Autowired
    private JwtUtils jwtUtils;

    private static final Logger logger = LoggerFactory.getLogger(WorkerServiceImpl.class);

    @Autowired
    private FirebaseService firebaseService;

    @Autowired
    private AuditLogRepository auditLogRepository;
    private Random random = new Random();

  /*
  public Worker addWorker(Worker worker) {
      // Handle Postes
      Set<Poste> postes = new HashSet<>();
      for (Poste poste : worker.getPostes()) {
          Enumposte posteName = poste.getName();
          Poste existingPoste = posteRepository.findByName(posteName);

          if (existingPoste != null) {
              postes.add(existingPoste);
          } else {
              Poste newPoste = new Poste();
              newPoste.setName(posteName);
              postes.add(newPoste);
          }
      }
      worker.setPostes(postes);

      // Handle Services
      Set<ServiceWork> services = new HashSet<>();
      for (ServiceWork service : worker.getServices()) {
          Enumservice serviceName = service.getName();
          ServiceWork existingService = serviceRepository.findByName(serviceName);

          if (existingService != null) {
              services.add(existingService);
          } else {
              ServiceWork newService = new ServiceWork();
              newService.setName(serviceName);
              services.add(newService);
          }
      }
      worker.setServices(services);

      return workerRepository.save(worker);
  }
*/

    @Override
    public Worker addWorker(Worker worker, String token) {
        String username = extractUsernameFromToken(token);
        logAction(username, "ADD", "Added a worker with matricule: " + worker.getMatricule());
        // Handle Postes
        Set<Poste> postes = new HashSet<>();
        for (Poste poste : worker.getPostes()) {
            Enumposte posteName = poste.getName();
            Poste existingPoste = posteRepository.findByName(posteName);

            if (existingPoste != null) {
                postes.add(existingPoste);
            } else {
                Poste newPoste = new Poste();
                newPoste.setName(posteName);
                postes.add(newPoste);
            }
        }
        worker.setPostes(postes);

        // Handle Services
        Set<ServiceWork> services = new HashSet<>();
        for (ServiceWork service : worker.getServices()) {
            Enumservice serviceName = service.getName();
            ServiceWork existingService = serviceRepository.findByName(serviceName);

            if (existingService != null) {
                services.add(existingService);
            } else {
                ServiceWork newService = new ServiceWork();
                newService.setName(serviceName);
                services.add(newService);
            }
        }
        worker.setServices(services);

        // Save the worker
        Worker savedWorker = workerRepository.save(worker);

        // Check chargeEsd and generate an alert if needed
        if (worker.getChargeEsd() != null) {
            if (worker.getChargeEsd() > 120) {
                generateAlertForHighCharge(savedWorker, "Danger");
            } else if (worker.getChargeEsd() >= 100 && worker.getChargeEsd() <= 120) {
                generateAlertForHighCharge(savedWorker, "Warning");
            }
        }
        return savedWorker;
    }
    @Override
    public String extractUsernameFromToken(String token) {
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
    @Override
    public void logAction(String username, String action, String message) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(username);
        auditLog.setAction(action);
        auditLog.setDetails(message);
        auditLog.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(auditLog);

        // Also log to the console
        logger.info("User: {}, Action: {}, Message: {}", username, action, message);
    }

    private void generateAlertForHighCharge(Worker worker, String status) {
        // Prepare alert details
        String title = "Charge ESD Alert";
        String message = "Worker " + worker.getNom() + " " + worker.getPrenom() + " has a charge ESD of " + worker.getChargeEsd();
        LocalDateTime timestamp = LocalDateTime.now();
        String demande = "en cours de traitement";

        // Build alert message
        List<User> allUsers = userRepository.findAll();
        for (User user : allUsers) {
            String alertMessage = buildAlertMessage(user, title, message, timestamp, status, demande);
            // Send email to the user asynchronously
            emailService.sendEmail(user.getEmail(), "Alert Notification", alertMessage);
        }

        // Optionally, you can also add the alert to Firebase or any other service
        Map<String, Object> alert = new HashMap<>();
        alert.put("title", title);
        alert.put("Matricule", worker.getMatricule());
        alert.put("message", message);
        alert.put("timestamp", timestamp.format(DateTimeFormatter.ISO_DATE_TIME));
        alert.put("status", status);
        alert.put("demande", demande);
        firebaseService.addAlert(alert);
    }
    private String buildAlertMessage(User user, String title, String message, LocalDateTime timestamp, String status, String demande) {
        return "<html>"
                + "<head>"
                + "<style>"
                + "body {"
                + "    font-family: 'Helvetica Neue', Arial, sans-serif;"
                + "    background-color: #f4f4f4;"
                + "    color: #333;"
                + "    padding: 20px;"
                + "    margin: 0;"
                + "}"
                + ".container {"
                + "    max-width: 800px;"
                + "    margin: auto;"
                + "    background-color: #fff;"
                + "    border-radius: 10px;"
                + "    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);"
                + "    overflow: hidden;"
                + "    border: 1px solid #ddd;"
                + "}"
                + ".header {"
                + "    background: linear-gradient(90deg, #FF7F7F, #FFB6B6);"
                + "    color: #fff;"
                + "    display: flex;"
                + "    align-items: center;"
                + "    padding: 20px;"
                + "    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"
                + "    border-radius: 10px;"
                + "}"
                + ".header img {"
                + "    height: 60px;"
                + "    margin-right: 20px;"
                + "}"
                + ".header h2 {"
                + "    margin: 0;"
                + "    font-size: 28px;"
                + "}"
                + ".content {"
                + "    padding: 30px;"
                + "}"
                + ".content p {"
                + "    font-size: 18px;"
                + "    margin: 15px 0;"
                + "    line-height: 1.6;"
                + "}"
                + ".content table {"
                + "    width: 100%;"
                + "    border-collapse: collapse;"
                + "    margin-top: 20px;"
                + "}"
                + ".content th, .content td {"
                + "    border: 1px solid #ddd;"
                + "    padding: 15px;"
                + "    text-align: left;"
                + "}"
                + ".content th {"
                + "    background-color: #FF7F7F;"
                + "    color: #fff;"
                + "}"
                + ".content tr:nth-child(even) {"
                + "    background-color: #f9f9f9;"
                + "}"
                + ".footer {"
                + "    text-align: center;"
                + "    padding: 15px;"
                + "    background-color: #f4f4f4;"
                + "    color: #777;"
                + "    font-size: 14px;"
                + "}"
                + ".footer a {"
                + "    color: #FF7F7F;"
                + "    text-decoration: none;"
                + "}"
                + ".button {"
                + "    display: inline-block;"
                + "    padding: 12px 25px;"
                + "    font-size: 16px;"
                + "    color: #fff;"
                + "    background-color: #FF7F7F;"
                + "    border-radius: 5px;"
                + "    text-decoration: none;"
                + "    margin-top: 20px;"
                + "    transition: background-color 0.3s ease;"
                + "    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"
                + "}"
                + ".button:hover {"
                + "    background-color: #FF4F4F;"
                + "}"
                + "</style>"
                + "</head>"
                + "<body>"
                + "<div class='container'>"
                + "<div class='header'>"
                + "<img src='cid:sagemcom_logo' alt='Sagemcom Logo'>"
                + "<h2>Alert Notification</h2>"
                + "</div>"
                + "<div class='content'>"
                + "<p>Dear " + user.getUserName() + ",</p>"
                + "<p>This is an alert notification from your application. Please find the details below:</p>"
                + "<table>"
                + "<tr>"
                + "<th>Title</th>"
                + "<td>" + title + "</td>"
                + "</tr>"
                + "<tr>"
                + "<th>Message</th>"
                + "<td>" + message + "</td>"
                + "</tr>"
                + "<tr>"
                + "<th>Status</th>"
                + "<td>" + status + "</td>"
                + "</tr>"
                + "<tr>"
                + "<th>Timestamp</th>"
                + "<td>" + timestamp.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + "</td>"
                + "</tr>"
                + "<tr>"
                + "<th>Request</th>"
                + "<td>" + demande + "</td>"
                + "</tr>"
                + "</table>"
                + "<p>Please take the necessary action.</p>"
                + "<p>Regards,<br>Your Application Team</p>"
                + "<div style='text-align: center; margin-top: 30px;'>"
                + "<a href='https://yourapp.com' class='button'>Visit Our Website</a>"
                + "</div>"
                + "</div>"
                + "<div class='footer'>"
                + "<p>If you have any questions, feel free to <a href='https://yourapp.com/contact'>contact us</a>.</p>"
                + "<p>© " + LocalDate.now().getYear() + " Your Application. All rights reserved.</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
    }








    public Worker getWorkerById(Long id) {
        return workerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Worker not found with id: " + id));
    }


    @Override
    public List<Worker> getAllWorkers() {
        List<Worker> workers = workerRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");

        // Format dates in each worker object
        for (Worker worker : workers) {
            LocalDate date = worker.getDate().toLocalDate();
            String formattedDate = date.format(formatter);
            // Update the date in the worker object
            worker.setDate(LocalDate.parse(formattedDate, formatter).atStartOfDay());
        }

        return workers;

    }

    @Override
    public List<Worker> getWorkersByTodayDate() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);

        return workerRepository.findByDateBetween(startOfDay, endOfDay);
    }
    @Override
    public List<Worker> getWorkersByLast7Days() {
        LocalDateTime startOfDay = LocalDate.now().minusDays(6).atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);

        return workerRepository.findByDateBetween(startOfDay, endOfDay);
    }

    @Override
    public List<Worker> getWorkersByExactDateTime(LocalDateTime dateTime) {
        return workerRepository.findByDate(dateTime);
    }
    public Worker updateWorker(Long id, Worker workerDetails) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Worker not found with id: " + id));

        worker.setNom(workerDetails.getNom());
        worker.setPrenom(workerDetails.getPrenom());
        worker.setEmail(workerDetails.getEmail());
     //   worker.setPoste(workerDetails.getPoste());
        worker.setDate(workerDetails.getDate());
        worker.setPhone(workerDetails.getPhone());
        worker.setChargeEsd(workerDetails.getChargeEsd());

        return workerRepository.save(worker);
    }

    public void deleteWorker(Long id) {
        workerRepository.deleteById(id);
    }

    @Override
    public List<Poste> findAll() {
        return  posteRepository.findAll();
    }

    @Override
    public List<ServiceWork> findAllServices() {
        return  serviceRepository.findAll();
    }
   @Override
    public List<Worker> findWorkersByPosteName(String posteName) {
        return workerRepository.findWorkersByPostes_Name(posteName);
    }
    @Override
    public List<Worker> getWorkersByPosteCMS1() {
        return workerRepository.findByPostes_Name(Enumposte.CMS1);
}
    @Override
    public List<Worker> getWorkersByPosteCMS2() {
        return workerRepository.findByPostes_Name(Enumposte.CMS2);
    }
    @Override
    public List<Worker> getWorkersByPosteIntegration() {
        return workerRepository.findByPostes_Name(Enumposte.Integration);
    }
    @Override
    public List<Worker> getWorkersByTodayDateAndPoste(String posteName) {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);

        return workerRepository.findByDateBetweenAndPostes_Name(startOfDay, endOfDay, Enumposte.valueOf(posteName));
    }
    @Override
    public List<Worker> getWorkersByLast7DaysAndPoste(String posteName) {
        LocalDateTime startOfDay = LocalDate.now().minusDays(6).atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(23, 59, 59);

        return workerRepository.findByDateBetweenAndPostes_Name(startOfDay, endOfDay, Enumposte.valueOf(posteName));
    }
    @Override
    public int countWorkersWithChargeEsdOver80() {
        return workerRepository.countByChargeEsdGreaterThan(80L);
    }
    @Override
    public int countWorkersWithChargeEsdBetween40And80() {
        return workerRepository.countByChargeEsdBetween(40L, 80L);
    }
    @Override
    public int countWorkersWithChargeEsdUnder40() {
        return workerRepository.countByChargeEsdLessThan(40L);
    }
    @Override
    public int countAllWorkers() {
        return (int) workerRepository.count();
    }




    @Override
    public Map<String, Object> countWorkersAndAverageChargeEsdByDayInLastWeek() {
        Map<String, Object> workersAndAverageChargeEsdByDay = new LinkedHashMap<>();

        // Get the start and end dates of the last week
        LocalDate endDate = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        LocalDate startDate = endDate.minusDays(6);

        // Previous day's date, average chargeEsd, and workers count
        LocalDate prevDate = null;
        Double prevDayAvgChargeEsd = null;

        // Iterate through each day of the last week
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            // Convert LocalDate to LocalDateTime
            LocalDateTime startOfDay = currentDate.atStartOfDay();
            LocalDateTime endOfDay = currentDate.atTime(LocalTime.MAX);

            // Retrieve workers for the current day
            List<Worker> workersForTheDay = workerRepository.findByDateBetween(startOfDay, endOfDay);
            int workersCount = workersForTheDay.size();

            // Calculate the average chargeEsd for the current day
            Double averageChargeEsd = workersForTheDay.stream()
                    .collect(Collectors.averagingDouble(Worker::getChargeEsd));

            // Calculate the change in average chargeEsd compared to the previous day
            String change = "";
            if (prevDayAvgChargeEsd != null) {
                double diff = averageChargeEsd - prevDayAvgChargeEsd;
                double percentChange = (diff / prevDayAvgChargeEsd) * 100;
                int roundedPercentChange = (int) Math.round(percentChange);
                if (roundedPercentChange > 0) {
                    change = "MORE (" + roundedPercentChange + "%)";
                } else if (roundedPercentChange < 0) {
                    change = "LOWER (" + Math.abs(roundedPercentChange) + "%)";
                }
            }

            // Format the date
            String formattedDate = currentDate.format(DateTimeFormatter.ISO_LOCAL_DATE);

            // Create a map to hold the data for the current day
            Map<String, Object> dayData = new HashMap<>();
            dayData.put("workersCount", workersCount);
            dayData.put("averageChargeEsd", averageChargeEsd);
            dayData.put("change", change);

            // Add data for the previous day
            if (prevDate != null) {
                dayData.put("prevDay", prevDate.format(DateTimeFormatter.ISO_LOCAL_DATE));
            }

            // Add the data to the map
            workersAndAverageChargeEsdByDay.put(formattedDate, dayData);

            // Store the current day's date and average chargeEsd as previous day's data for the next iteration
            prevDate = currentDate;
            prevDayAvgChargeEsd = averageChargeEsd;

            // Move to the next day
            currentDate = currentDate.plusDays(1);
        }

        return workersAndAverageChargeEsdByDay;
    }




    @Override
    public Map<String, Long> countWorkersByPostNames() {
        Map<String, Long> countMap = new HashMap<>();
        countMap.put("CMS1", workerRepository.countByPostesName(Enumposte.CMS1));
        countMap.put("CMS2", workerRepository.countByPostesName(Enumposte.CMS2));
        countMap.put("Integration", workerRepository.countByPostesName(Enumposte.Integration));
        return countMap;
    }
    @Override
    public List<Worker> getTop10WorkersByChargeEsd() {
        return workerRepository.findTop10ByOrderByChargeEsdDesc();
    }

  /*  @Override
    public List<Worker> getWorkersByDate(LocalDateTime date) {
        // Query the database to find workers with the specified date
        return workerRepository.findByDate(date);
    }*/
  @Override
  public List<Worker> getWorkersByDate(LocalDateTime dateTime) {
      // Query the database to find workers with the exact specified date-time
      return workerRepository.findByDate(dateTime);
  }

    @Override
    public List<Worker> getWorkersByDateRange(LocalDateTime start, LocalDateTime end) {
        // Query the database to find workers within the specified date range
        return workerRepository.findByDateRange(start, end);
    }
    @Override
    public Map<String, Object> calculateStatisticsForLastWeek() {
        Map<String, Object> statisticsByDay = new LinkedHashMap<>();

        // Get the start and end dates of the last week
        LocalDate endDate = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        LocalDate startDate = endDate.minusDays(6);

        // Iterate through each day of the last week
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            // Convert LocalDate to LocalDateTime
            LocalDateTime startOfDay = currentDate.atStartOfDay();
            LocalDateTime endOfDay = currentDate.atTime(LocalTime.MAX);

            // Retrieve workers for the current day
            List<Worker> workersForTheDay = workerRepository.findByDateBetween(startOfDay, endOfDay);
            int totalWorkersCount = workersForTheDay.size();

            // Calculate the average chargeEsd for the current day
            Double averageChargeEsd = workersForTheDay.stream()
                    .collect(Collectors.averagingDouble(Worker::getChargeEsd));

            // Initialize percentage values
            double under40Percentage = 0;
            double between40And80Percentage = 0;
            double over80Percentage = 0;

            if (totalWorkersCount > 0) {
                // Calculate the counts
                long under40Count = workersForTheDay.stream().filter(worker -> worker.getChargeEsd() < 40).count();
                long between40And80Count = workersForTheDay.stream().filter(worker -> worker.getChargeEsd() >= 40 && worker.getChargeEsd() <= 80).count();
                long over80Count = workersForTheDay.stream().filter(worker -> worker.getChargeEsd() > 80).count();

                // Calculate the percentages
                under40Percentage = (double) under40Count / totalWorkersCount * 100;
                between40And80Percentage = (double) between40And80Count / totalWorkersCount * 100;
                over80Percentage = (double) over80Count / totalWorkersCount * 100;
            }

            // Create a map to hold the statistics for the current day
            Map<String, Object> dayStatistics = new HashMap<>();
            dayStatistics.put("averageChargeEsd", averageChargeEsd);
            dayStatistics.put("under40Percentage", under40Percentage);
            dayStatistics.put("between40And80Percentage", between40And80Percentage);
            dayStatistics.put("over80Percentage", over80Percentage);

            // Format the date
            String formattedDate = currentDate.format(DateTimeFormatter.ISO_LOCAL_DATE);

            // Add the statistics for the current day to the map
            statisticsByDay.put(formattedDate, dayStatistics);

            // Move to the next day
            currentDate = currentDate.plusDays(1);
        }

        return statisticsByDay;
    }




    // Helper method to calculate percentage
    private double calculatePercentage(long total, long count) {
        return total == 0 ? 0 : (double) count / total * 100;
    }





    // this method allow me to add a service
    @Override
    public ServiceWork addServiceWork(Enumservice name) {
        ServiceWork existingServiceWork = serviceRepository.findByName(name);
        if (existingServiceWork != null) {
            throw new IllegalArgumentException("ServiceWork with name " + name + " already exists");
        }

        ServiceWork newServiceWork = new ServiceWork();
        newServiceWork.setName(name);
        return serviceRepository.save(newServiceWork);
    }

    // this method allow to add a poste
    @Override
    public Poste addPoste(Enumposte name) {
        Poste existingPoste = posteRepository.findByName(name);
        if (existingPoste != null) {
            throw new IllegalArgumentException("Poste with name " + name + " already exists");
        }

        Poste newPoste = new Poste();
        newPoste.setName(name);
        return posteRepository.save(newPoste);
    }


    @Override
    public List<Worker> findWorkersByMatricule(String matricule) {
        return workerRepository.findByMatricule(matricule);
    }
    @Override
    public String getAverageChargeEsdByMatricule(String matricule) {
        List<Worker> workers = workerRepository.findByMatricule(matricule);
        double averageChargeEsd = workers.stream()
                .mapToLong(Worker::getChargeEsd)
                .average()
                .orElse(0.0);

        // Format the double value to display only two decimal places
        return String.format("%.2f", averageChargeEsd);
    }

    @Override
    public void generateAndSaveWorkers(int numberOfWorkers) {
        for (int i = 0; i < numberOfWorkers; i++) {
            Worker worker = new Worker();
            worker.setMatricule("G-110");
            worker.setNom(randomString(5));
            worker.setPrenom(randomString(5));
            worker.setEmail(UUID.randomUUID().toString() + "@sagemcom.com");
            worker.setChargeEsd((long) 110);
            worker.setPhone(randomString(10));
            worker.setDate(randomDate(2024));

            workerRepository.save(worker);
        }
    }

    private String randomString(int length) {
        return random.ints(97, 122 + 1)
                .limit(length)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();
    }

    private LocalDateTime randomDate(int year) {
        int dayOfYear = random.nextInt(LocalDate.of(year, 1, 1).lengthOfYear()) + 1; // Ensure dayOfYear is in range 1-365/366
        return LocalDate.ofYearDay(year, dayOfYear).atStartOfDay();
    }

    /*@Override
    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }*/
  @Override
  public List<AuditLog> getAllAuditLogs() {
      return auditLogRepository.findAllByOrderByTimestampDesc();
  }
    @Override
    public Page<AuditLog> getFilteredAuditLogs(String action, String username, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return auditLogRepository.findByCriteria(action, username, startDate, endDate, pageable);
    }
}



