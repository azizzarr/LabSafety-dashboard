package tn.esprit.repositories;


import java.util.Optional;
import tn.esprit.entities.ERole;
import tn.esprit.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(ERole name);

}
