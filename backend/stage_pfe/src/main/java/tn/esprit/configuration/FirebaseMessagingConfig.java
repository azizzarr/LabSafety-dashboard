/*package tn.esprit.campusconnect.configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;



@Configuration
public class FirebaseMessagingConfig {
    @Value("notificationfirebase-f1a2c-firebase-adminsdk-f9tly-27e3911547.json")
    private String firebaseServerKey;

    @Bean
    public FirebaseMessaging firebaseMessaging() throws IOException {
        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(new ClassPathResource("notificationfirebase-f1a2c-firebase-adminsdk-f9tly-27e3911547.json").getInputStream()))
                .build();

        FirebaseApp.initializeApp(options);

        return FirebaseMessaging.getInstance();
    }

    @Bean
    public String firebaseServerKey() {
        return firebaseServerKey;
    }
}
*/