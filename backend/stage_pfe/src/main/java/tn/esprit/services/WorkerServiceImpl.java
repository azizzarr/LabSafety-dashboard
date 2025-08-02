package tn.esprit.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.Interfaces.IWorkerService;
import tn.esprit.entities.Worker;
import tn.esprit.repositories.WorkerRepository;

import javax.persistence.EntityNotFoundException;
import java.util.List;
@Service
public class WorkerServiceImpl implements IWorkerService {

    @Autowired
    private WorkerRepository workerRepository;

    public Worker addWorker(Worker worker) {
        return workerRepository.save(worker);
    }

    public Worker getWorkerById(Long id) {
        return workerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Worker not found with id: " + id));
    }

    public List<Worker> getAllWorkers() {
        return workerRepository.findAll();
    }

    public Worker updateWorker(Long id, Worker workerDetails) {
        Worker worker = workerRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Worker not found with id: " + id));

        worker.setNom(workerDetails.getNom());
        worker.setPrenom(workerDetails.getPrenom());
        worker.setEmail(workerDetails.getEmail());
        worker.setPoste(workerDetails.getPoste());
        worker.setBirthdate(workerDetails.getBirthdate());
        worker.setPhone(workerDetails.getPhone());
        worker.setChargeEsd(workerDetails.getChargeEsd());

        return workerRepository.save(worker);
    }

    public void deleteWorker(Long id) {
        workerRepository.deleteById(id);
    }
}
