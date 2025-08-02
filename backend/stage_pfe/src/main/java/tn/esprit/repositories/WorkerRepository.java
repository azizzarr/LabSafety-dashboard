package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.entities.Worker;

public interface WorkerRepository extends JpaRepository<Worker, Long> {
}
