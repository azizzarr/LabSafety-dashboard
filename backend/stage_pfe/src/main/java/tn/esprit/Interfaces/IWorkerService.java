package tn.esprit.Interfaces;

import tn.esprit.entities.Worker;

import java.util.List;

public interface IWorkerService {
    Worker addWorker(Worker worker);

    Worker getWorkerById(Long id);

    List<Worker> getAllWorkers();

    Worker updateWorker(Long id, Worker workerDetails);

    void deleteWorker(Long id);
}
