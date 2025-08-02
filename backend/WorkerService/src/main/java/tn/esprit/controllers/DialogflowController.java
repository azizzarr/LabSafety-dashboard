package tn.esprit.controllers;

import org.springframework.web.bind.annotation.*;
import tn.esprit.services.DialogflowService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/chatbot")
public class DialogflowController {
    private static final Logger logger = LoggerFactory.getLogger(DialogflowController.class);

    private final DialogflowService dialogflowService;

    public DialogflowController(DialogflowService dialogflowService) {
        this.dialogflowService = dialogflowService;
    }

 /*   @PostMapping("/query")
    public Map<String, String> queryDialogflow(@RequestBody Map<String, String> request) throws IOException {
        String prompt = request.get("prompt");
        String projectId = "quiet-amp-425205-k5"; // Replace with your Dialogflow project ID

        // Log the received request for debugging
        logger.info("Received request: {}", request);

        String response = dialogflowService.detectIntent(projectId, prompt);
        return Map.of("response", response);
    }*/
 @PostMapping("/query")
 public Map<String, String> queryDialogflow(@RequestBody Map<String, Object> request) throws IOException {
     // Extract the prompt string from the request body
     String prompt = (String) request.get("queryResult");

     logger.info("Received request: {}", request);
     logger.info("Extracted prompt: {}", prompt);

     // Check if prompt is null or empty
     if (prompt == null || prompt.isEmpty()) {
         logger.error("Received null or empty prompt");
         throw new IllegalArgumentException("Prompt cannot be null or empty");
     }

     String projectId = "quiet-amp-425205-k5"; // Replace with your Dialogflow project ID

     // Call detectIntent and handle the response
     String response = dialogflowService.detectIntent(projectId, prompt);

     // Construct a response map to return
     Map<String, String> responseBody = new HashMap<>();
     responseBody.put("response", response);

     return responseBody;
 }


}
