package tn.esprit.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.Permission;
import tn.esprit.entities.PermissionName;
import tn.esprit.entities.User;
import tn.esprit.entities.UserPermission;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPermissionRepository extends JpaRepository<UserPermission, Long> {





                Optional<UserPermission> findByPermissionName(PermissionName permissionName);
    List<UserPermission> findByUserAndPermissionName(User user, PermissionName permissionName);




}

