package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.entities.Enumposte;
import tn.esprit.entities.Enumservice;
import tn.esprit.entities.Poste;
import tn.esprit.entities.ServiceWork;

public interface ServiceRepository extends JpaRepository<ServiceWork, Long> {
    ServiceWork findByName(Enumservice name);
}
