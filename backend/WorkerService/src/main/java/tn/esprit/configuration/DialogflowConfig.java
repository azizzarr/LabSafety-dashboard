package tn.esprit.configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.dialogflow.v2.SessionsClient;
import com.google.cloud.dialogflow.v2.SessionsSettings;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class DialogflowConfig {

    @Bean
    public SessionsClient sessionsClient() throws IOException {
        // Correcting the file path syntax
        String jsonPath = "C:\\Users\\azizz\\Desktop\\quiet-amp-425205-k5-c6092912ae07.json";
        GoogleCredentials credentials = GoogleCredentials.fromStream(new FileInputStream(jsonPath));
        SessionsSettings sessionsSettings = SessionsSettings.newBuilder().setCredentialsProvider(() -> credentials).build();
        return SessionsClient.create(sessionsSettings);
    }
}
