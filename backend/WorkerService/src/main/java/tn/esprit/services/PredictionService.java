package tn.esprit.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import tn.esprit.configuration.CSVUtils;
import tn.esprit.configuration.DataGenerationUtils;
import tn.esprit.entities.Worker;
import tn.esprit.repositories.WorkerRepository;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;

@Service
public class PredictionService {

    @Autowired
    private WorkerRepository workerRepository;

    private static final String PYTHON_API_URL = "http://127.0.0.1:8050";
    private static final String DASH_URL = "http://127.0.0.1:8050";
    public void exportWorkerDataToCSVWithSyntheticData() throws IOException {
        List<Worker> workers = workerRepository.findAll();
        String csvFilePath = "C:\\Users\\azizz\\Desktop\\Prediction.csv";
        int additionalRecords = 1000; // Number of synthetic records to generate
        DataGenerationUtils.writeWorkersToCSVWithSyntheticData(workers, csvFilePath, additionalRecords);
    }
    public List<Map<String, Object>> getPrediction() {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                PYTHON_API_URL,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>(){}
        );
        return response.getBody();
    }

    public String getDashPageUrl() {
        return DASH_URL;
    }
}
