package tn.esprit.Interfaces;

import org.springframework.web.multipart.MultipartFile;
import tn.esprit.entities.Permission;
import tn.esprit.entities.PermissionName;
import tn.esprit.entities.User;
import tn.esprit.entities.UserPermission;


import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IUserService {
    User updateUser(User updatedUser, Long userId, String token);

    List<User> getUsersByRoleRH();

    List<User> getUsersByRoleAdmin();

    User findById(Long userId);

    List<User> getAllUsers();

    String extractUsernameFromToken(String token);

    void logAction(String username, String action, String details);

    User getUserById(Long userId);
    User saveUser(User user);
    void deleteUser(Long userId, String token);

    void updatePasswordByEmail(String email, String newPassword, String token);

    Set<UserPermission> getUserPermissionsByUserName(String userName);

    void addPermissionToUser(Long userId, PermissionName permissionName);


  //  void addPermissionToUser(String userName, PermissionName permissionName);

    void addPermissionToUser(String userName, PermissionName permissionName, String token);

    boolean hasPermission(Long userId, PermissionName permissionName);
    User saveUser1(User user);

    void addUserIfHasPermission(User user, PermissionName permissionName);

    User findUserById(long userId);

    List<User> importUsersFromExcel(String filePath) throws IOException;
    void exportUsersToExcel(String filePath) throws IOException;

    //void initiatePasswordReset(String email);

    void initiatePasswordReset(Long userId);

    void enableTwoFactorAuth(String email);
    boolean validatePasswordResetToken(String email, String token);
  //  void resetPassword(String email, String newPassword);

    boolean hasPermission(String token, PermissionName permissionName);

    // Utility method to generate 2FA code
    String generateTwoFactorAuthCode();

    void sendPasswordResetEmail(String email, String resetToken);
    void sendTwoFactorAuthCodeEmail(String email, String twoFactorAuthCode);
    String generateResetToken(User user);
    void updatePassword(User user, String newPassword);

    User findUserByUserName(String userName);





    User getUserByEmail(String email);

   // void updatePasswordByEmail(String email, String newPassword);

    int countUsersWithAdminRole();

    int countUsersWithRhRole();

    int countUsersWithUserRole();
}
