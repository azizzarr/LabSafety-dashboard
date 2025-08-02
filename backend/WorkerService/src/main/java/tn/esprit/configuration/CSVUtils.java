package tn.esprit.configuration;
import tn.esprit.entities.Worker;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

public class CSVUtils {
    public static void writeWorkersToCSV(List<Worker> workers, String filePath) throws IOException {
        try (FileWriter writer = new FileWriter(filePath)) {
            writer.append("ds,y\n"); // Header for Prophet (ds: date, y: value)
            for (Worker worker : workers) {
                if (worker.getDate() != null && worker.getChargeEsd() != null) {
                    writer.append(worker.getDate().toString()).append(",").append(worker.getChargeEsd().toString()).append("\n");
                }
            }
        }
    }
}