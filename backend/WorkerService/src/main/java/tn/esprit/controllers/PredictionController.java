package tn.esprit.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.services.PredictionService;

@RestController
@RequestMapping("/api/predict")
public class PredictionController {

    @Autowired
    private PredictionService predictionService;

    @GetMapping("/exportWithSyntheticData")
    public ResponseEntity<String> exportWorkerDataToCSVWithSyntheticData() {
        try {
            predictionService.exportWorkerDataToCSVWithSyntheticData();
            return ResponseEntity.ok("Data exported to CSV with synthetic data successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

}
