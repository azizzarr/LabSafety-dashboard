package tn.esprit.controllers;

import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.ValueEventListener;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.entities.Alert;
import tn.esprit.services.FirebaseService;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.logging.Logger;

@CrossOrigin(origins = "http://localhost:65495")
@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private FirebaseService firebaseService;

    private static final Logger logger = Logger.getLogger(AlertController.class.getName());

    @PostMapping
    public String addAlert(@RequestBody Map<String, Object> alert) {
        return firebaseService.addAlert(alert);
    }

    @GetMapping
    public Map<String, Object> getAlerts() {
        return firebaseService.getAlerts();
    }

    @GetMapping("/generate")
    public Map<String, Object> generateAlert() {
        Map<String, Object> alert = new HashMap<>();
        alert.put("title", "Generated Alert");
        alert.put("message", "This is a generated alert");
        alert.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));

        String alertId = firebaseService.addAlert(alert);
        alert.put("id", alertId);

        logger.info("Generated Alert: " + alert);

        return alert;
    }

    @GetMapping("/all")
    public Map<String, Object> getAllAlerts() {
        final Map<String, Object> alerts = new HashMap<>();
        final CountDownLatch latch = new CountDownLatch(1);

        firebaseService.getAllAlerts(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                for (DataSnapshot alertSnapshot : dataSnapshot.getChildren()) {
                    alerts.put(alertSnapshot.getKey(), alertSnapshot.getValue());
                }
                latch.countDown();
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle possible errors.
                latch.countDown();
            }
        });

        try {
            latch.await();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        return alerts;
    }

    @GetMapping("/{key}")
    public Map<String, Object> getAlertByKey(@PathVariable String key) {
        return firebaseService.getAlertByKey(key);
    }

    @GetMapping("/databaseAlerts")
    public List<Alert> getAllAlertsFromDatabase() {
        return firebaseService.getAllAlertsFromDatabase();
    }

    @PutMapping("/validate/{id}")
    public void validateAlert(@PathVariable Long id,@RequestHeader("Authorization") String token) {
        firebaseService.validateAlert(id,token);
    }

    @GetMapping("/today")
    public List<Alert> getAlertsForToday() {
        return firebaseService.getAlertsForToday();
    }

    @GetMapping("/last-week")
    public List<Alert> getAlertsForLastWeek() {
        return firebaseService.getAlertsForLastWeek();
    }

    @GetMapping("/last-month")
    public List<Alert> getAlertsForLastMonth() {
        return firebaseService.getAlertsForLastMonth();
    }

    @GetMapping("/ordered")
    public List<Alert> getOrderedAlertsByTime() {
        return firebaseService.getOrderedAlertsByTime();
    }
}
