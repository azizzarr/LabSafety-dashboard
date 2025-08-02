package tn.esprit.services;

import com.google.firebase.database.*;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;
import tn.esprit.entities.Alert;
import tn.esprit.entities.User;
import tn.esprit.repositories.AlertRepository;
import com.google.firebase.messaging.Message;
import tn.esprit.repositories.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutionException;

@Service
@DependsOn("initializeFirebase")
public class FirebaseService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkerServiceImpl workerService;

    private final DatabaseReference databaseReference;

    public FirebaseService() {
        databaseReference = FirebaseDatabase.getInstance().getReference();
    }

    public String addAlert(Map<String, Object> alert) {
        String key = databaseReference.child("alerts").push().getKey();
        if (key != null) {
            databaseReference.child("alerts").child(key).setValueAsync(alert);
        }

        // Save to MySQL database
        Alert newAlert = new Alert();
        newAlert.setTitle((String) alert.get("title"));
        newAlert.setMessage((String) alert.get("message"));
        newAlert.setTimestamp(LocalDateTime.now());
        newAlert.setStatus((String) alert.get("status"));
        newAlert.setDemande("en cours de traitement"); // Default value
        alertRepository.save(newAlert);

        return key;
    }

    public List<Alert> getOrderedAlertsByTime() {
        List<Alert> alertList = new ArrayList<>();
        DatabaseReference alertsRef = databaseReference.child("alerts");
        final CountDownLatch latch = new CountDownLatch(1);

        alertsRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                for (DataSnapshot alertSnapshot : dataSnapshot.getChildren()) {
                    Alert alert = alertSnapshot.getValue(Alert.class);
                    if (alert != null) {
                        alertList.add(alert);
                    }
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

        Collections.sort(alertList, Comparator.comparing(Alert::getTimestamp).reversed());
        return alertList;
    }

    public Map<String, Object> getAlerts() {
        Map<String, Object> alerts = new HashMap<>();

        DatabaseReference alertsRef = databaseReference.child("alerts");

        alertsRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                for (DataSnapshot alertSnapshot : dataSnapshot.getChildren()) {
                    alerts.put(alertSnapshot.getKey(), alertSnapshot.getValue());
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Handle possible errors.
            }
        });

        return alerts;
    }

    public void getAllAlerts(ValueEventListener valueEventListener) {
        DatabaseReference alertsRef = databaseReference.child("alerts");
        alertsRef.addListenerForSingleValueEvent(valueEventListener);
    }

    public Map<String, Object> getAlertByKey(String key) {
        final Map<String, Object> alert = new HashMap<>();
        final CountDownLatch latch = new CountDownLatch(1);

        DatabaseReference alertRef = databaseReference.child("alerts").child(key);
        alertRef.addListenerForSingleValueEvent(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                alert.put("key", dataSnapshot.getKey());
                alert.put("value", dataSnapshot.getValue());
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

        return alert;
    }

    // New method to get all alerts from MySQL database
    public List<Alert> getAllAlertsFromDatabase() {
        return alertRepository.findAllByOrderByTimestampDesc();
    }

    public List<Alert> getAlertsForToday() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);
        return alertRepository.findAllByToday(startOfDay, endOfDay);
    }

    public List<Alert> getAlertsForLastWeek() {
        LocalDateTime startOfWeek = LocalDate.now().minus(1, ChronoUnit.WEEKS).atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atStartOfDay().plusDays(1).minusNanos(1);
        return alertRepository.findAllByLastWeek(startOfWeek, endOfDay);
    }

    public List<Alert> getAlertsForLastMonth() {
        LocalDateTime startOfMonth = LocalDate.now().minus(1, ChronoUnit.MONTHS).atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atStartOfDay().plusDays(1).minusNanos(1);
        return alertRepository.findAllByLastMonth(startOfMonth, endOfDay);
    }

    public void validateAlert(Long id, String token) {
        String username = workerService.extractUsernameFromToken(token);
        Alert alert = alertRepository.findById(id).orElse(null);
        workerService.logAction(username, "Alert Validation", "validate an alert with message: " + alert.getMessage());
        if (alert != null) {
            alert.setDemande("validé");
            alertRepository.save(alert);
        }
    }
}
