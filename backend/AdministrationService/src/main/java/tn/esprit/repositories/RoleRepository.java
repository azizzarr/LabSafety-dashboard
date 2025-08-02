package tn.esprit.repositories;


import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tn.esprit.entities.ERole;
import tn.esprit.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.entities.User;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(ERole name);

    @Query("SELECT u FROM User u WHERE u.roles = :role")
    User findByRole(@Param("role") String role);


}
