package tn.esprit.services;

import com.google.cloud.dialogflow.v2.*;
import com.google.protobuf.Struct;
import com.google.protobuf.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.entities.Enumposte;
import tn.esprit.entities.Worker;
import tn.esprit.repositories.WorkerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class DialogflowService {
    private final SessionsClient sessionsClient;
    private final WorkerRepository workerRepository;
    private static final Logger logger = LoggerFactory.getLogger(DialogflowService.class);

    @Autowired
    public DialogflowService(SessionsClient sessionsClient, WorkerRepository workerRepository) {
        this.sessionsClient = sessionsClient;
        this.workerRepository = workerRepository;
    }

    public String detectIntent(String projectId, String prompt) throws IOException {
        String sessionId = UUID.randomUUID().toString();  // Generate a unique session ID for each request
        SessionName session = SessionName.of(projectId, sessionId);
        TextInput.Builder textInput = TextInput.newBuilder().setText(prompt).setLanguageCode("en-US");

        QueryInput queryInput = QueryInput.newBuilder().setText(textInput).build();

        DetectIntentRequest request = DetectIntentRequest.newBuilder().setSession(session.toString()).setQueryInput(queryInput).build();

        DetectIntentResponse response = sessionsClient.detectIntent(request);

        QueryResult queryResult = response.getQueryResult();
        String intentName = queryResult.getIntent().getDisplayName();
        Struct parameters = queryResult.getParameters();
        String fulfillmentText = handleIntent(intentName, parameters);

        return fulfillmentText;
    }

    public String handleIntent(String intentName, Struct parameters) {
        String response = "";
        switch (intentName) {
            case "GetWorkersByPosteName":
                String posteName = parameters.getFieldsMap().get("posteName").getStringValue();
                response = getWorkersByPosteName(posteName);
                break;
            case "CountWorkersByChargeEsd":
                long chargeEsd = (long) parameters.getFieldsMap().get("chargeEsd").getNumberValue();
                response = countWorkersByChargeEsd(chargeEsd);
                break;
            case "CountWorkersByDate":
                String dateStr = parameters.getFieldsMap().get("date").getStringValue();
                response = countWorkersByDate(dateStr);
                break;
            case "FindWorkersByDateRange":
                String startDateStr = parameters.getFieldsMap().get("startDate").getStringValue();
                String endDateStr = parameters.getFieldsMap().get("endDate").getStringValue();
                response = findWorkersByDateRange(startDateStr, endDateStr);
                break;
            default:
                response = "Sorry, I don't understand that request.";
        }
        return response;
    }

    private String getWorkersByPosteName(String posteName) {
        if (posteName == null || posteName.isEmpty()) {
            return "Please provide a valid poste name.";
        }

        logger.info("Searching for workers with poste name: {}", posteName); // Log the posteName provided

        try {
            Enumposte posteEnum = Enumposte.valueOf(posteName); // Convert String to Enumposte enum
            List<Worker> workers = workerRepository.findByPostes_Name(posteEnum);

            if (workers.isEmpty()) {
                return "No workers found with the poste name: " + posteName;
            } else {
                return workers.stream()
                        .map(worker -> String.format("%s %s", worker.getNom(), worker.getPrenom()))
                        .collect(Collectors.joining(", "));
            }
        } catch (IllegalArgumentException e) {
            logger.error("Invalid poste name provided: {}", posteName); // Log the error with invalid posteName
            return "Invalid poste name: " + posteName;
        }
    }

    public String countWorkersByChargeEsd(long chargeEsd) {
        int count = workerRepository.countByChargeEsdGreaterThan(chargeEsd);
        return "Number of workers with charge ESD greater than " + chargeEsd + ": " + count;
    }

    private String countWorkersByDate(String dateStr) {
        LocalDate date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_DATE);
        int count = workerRepository.countByDate(date);
        return "Number of workers on date " + dateStr + ": " + count;
    }

    private String findWorkersByDateRange(String startDateStr, String endDateStr) {
        LocalDateTime startDate = LocalDateTime.parse(startDateStr, DateTimeFormatter.ISO_DATE_TIME);
        LocalDateTime endDate = LocalDateTime.parse(endDateStr, DateTimeFormatter.ISO_DATE_TIME);
        List<Worker> workers = workerRepository.findByDateRange(startDate, endDate);
        if (workers.isEmpty()) {
            return "No workers found between " + startDateStr + " and " + endDateStr;
        } else {
            return workers.stream()
                    .map(worker -> String.format("%s %s", worker.getNom(), worker.getPrenom()))
                    .collect(Collectors.joining(", "));
        }
    }
}
