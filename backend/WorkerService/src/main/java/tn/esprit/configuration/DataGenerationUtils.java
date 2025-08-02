package tn.esprit.configuration;

import tn.esprit.entities.Worker;

import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

public class DataGenerationUtils {

    private static final Random RANDOM = new Random();
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static void writeWorkersToCSVWithSyntheticData(List<Worker> workers, String filePath, int additionalRecords) throws IOException {
        try (FileWriter writer = new FileWriter(filePath)) {
            writer.append("ds,y\n"); // Header for Prophet (ds: date, y: value)

            // Write existing worker data
            for (Worker worker : workers) {
                if (worker.getDate() != null && worker.getChargeEsd() != null) {
                    writer.append(worker.getDate().format(DATE_TIME_FORMATTER)).append(",").append(worker.getChargeEsd().toString()).append("\n");
                }
            }

            // Generate and write synthetic data
            LocalDateTime startDate = LocalDateTime.of(2024, 5, 1, 0, 0); // May 1st, 2024
            LocalDateTime endDate = LocalDateTime.of(2024, 6, 30, 23, 59); // June 30th, 2024
            long totalMinutes = ChronoUnit.MINUTES.between(startDate, endDate);

            for (int i = 0; i < additionalRecords; i++) {
                LocalDateTime date = startDate.plusMinutes(i * totalMinutes / additionalRecords);

                // Generate a random chargeEsd value between 0 and 200
                double chargeEsd = RANDOM.nextDouble() * 200; // Random value in the range 0 to 200
                writer.append(date.format(DATE_TIME_FORMATTER)).append(",").append(String.valueOf(chargeEsd)).append("\n");
            }
        }
    }
}
