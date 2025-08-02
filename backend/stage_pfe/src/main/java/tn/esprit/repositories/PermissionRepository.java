package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.Permission;
import tn.esprit.entities.PermissionName;
import tn.esprit.entities.UserPermission;

import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    // Add custom query methods if needed
    //Optional<Permission> findByName(String name);
    Optional<Permission> findByName(PermissionName name);


}

