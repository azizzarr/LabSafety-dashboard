package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.entities.Enumposte;
import tn.esprit.entities.Permission;
import tn.esprit.entities.Poste;

import java.util.Optional;

public interface PosteRepository  extends JpaRepository<Poste, Long> {
 Poste findByName(Enumposte name);

}
