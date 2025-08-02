package tn.esprit.Interfaces;

import org.springframework.web.multipart.MultipartFile;
import tn.esprit.entities.Permission;
import tn.esprit.entities.PermissionName;
import tn.esprit.entities.User;
import tn.esprit.entities.UserPermission;


import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface IUserService {
    User findById(Long userId);

    List<User> getAllUsers();
    User getUserById(Long userId);
    User saveUser(User user);
    void deleteUser(Long userId);
    User updateUser(User user, Long userID);

    // Method to update an existing user permission
   // UserPermission updatePermission(User grantor, User grantee, Permission permission);

    // Method to delete an existing user permission
  //  void deletePermission(User grantor, User grantee, Permission permission);

    // Method to find all permissions granted by a user
    //List<UserPermission> findAllPermissionsGrantedByUser(User grantor);

    // Method to find all permissions granted to a user
    //List<UserPermission> findAllPermissionsGrantedToUser(User grantee);

    // Method to add a new user permission
   // UserPermission addPermission(Long grantorId, Long granteeId, PermissionName permissionName );

  //  UserPermission addPermission(UserPermission userPermission);
  //void addPermissionToUser(Long userId, String permissionName);

   // void addPermissionToUser(Long userId, PermissionName permissionName);

    void addPermissionToUser(Long userId, PermissionName permissionName);

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


    // Utility method to generate 2FA code
    String generateTwoFactorAuthCode();

    void sendPasswordResetEmail(String email, String resetToken);
    void sendTwoFactorAuthCodeEmail(String email, String twoFactorAuthCode);
    String generateResetToken(User user);
    void updatePassword(User user, String newPassword);

    User findUserByUserName(String userName);

    boolean hasWritePermission(String token);
}
