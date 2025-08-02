package tn.esprit.repositories;



import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import tn.esprit.entities.ERole;
import tn.esprit.entities.Role;
import tn.esprit.entities.User;

import java.util.List;
import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {


    Optional<User> findByUserName(String userName);


    Boolean existsByUserName(String userName);

    Boolean existsByEmail(String email);

    boolean existsByUserId(Long userId);

    User findByEmail(String email);

   // List<UserPermission> findByUserName(String userName);

    User findByResetToken(String resetToken);

    User findByEmailAndResetToken(String email, String resetToken);

    int countUsersByRolesContains(Optional<Role> role);
    List<User> findByRolesName(ERole roleName);


    User findByTwoFactorAuthCode(String twoFactorAuthCode);

    User findByEmailAndTwoFactorAuthCode(String email, String twoFactorAuthCode);
  //  Optional<User> findByUsername(String userName);
}

