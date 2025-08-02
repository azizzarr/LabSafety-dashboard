package tn.esprit.repositories;



import org.springframework.data.jpa.repository.JpaRepository;

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
   // List<User> findByRolesName(ERole roleName);
   List<User> findByRolesName(ERole roleName);

    User findByEmail(String email);

   // List<UserPermission> findByUserName(String userName);

    User findByResetToken(String resetToken);

    User findByEmailAndResetToken(String email, String resetToken);

    List<User> findByPhoneIn(List<String> phoneNumbers);

    int countUsersByRolesContains(Optional<Role> role);

    User findByTwoFactorAuthCode(String twoFactorAuthCode);

    User findByEmailAndTwoFactorAuthCode(String email, String twoFactorAuthCode);
  //  Optional<User> findByUsername(String userName);
}

