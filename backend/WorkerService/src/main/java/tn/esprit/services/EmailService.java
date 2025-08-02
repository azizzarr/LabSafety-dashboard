package tn.esprit.services;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.io.IOException;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;
    @Async
    public void sendEmail(String recipientEmail, String subject, String messageContent) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Set recipient, subject, and HTML message content
            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(messageContent, true); // Set to true to indicate that the message is HTML

            // Load and attach the logo as an inline image
            ClassPathResource logoResource = new ClassPathResource("sagemcom.png");
            helper.addInline("sagemcom_logo", logoResource);

            // Send the email
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            e.printStackTrace(); // Handle the exception appropriately in production code
        }
    }

}

