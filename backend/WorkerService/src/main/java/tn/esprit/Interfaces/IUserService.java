package tn.esprit.Interfaces;

import org.springframework.web.multipart.MultipartFile;
import tn.esprit.entities.*;


import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface IUserService {




    /*  @Override
      public List<User> getUsersByRoleRH() {
          // Query the repository to fetch users with the role "ROLE_RH"
          return userRepository.findByRolesName(ERole.ROLE_RH);
      }
  */


    /*  @Override
      public List<User> getUsersByRoleRH() {
          // Query the repository to fetch users with the role "ROLE_RH"
          return userRepository.findByRolesName(ERole.ROLE_RH);
      }
  */


    /*  @Override
      public List<User> getUsersByRoleRH() {
          // Query the repository to fetch users with the role "ROLE_RH"
          return userRepository.findByRolesName(ERole.ROLE_RH);
      }
  */
    List<User> getUsersByRoleRH();

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

    Set<UserPermission> getUserPermissionsByUserName(String userName);

    void addPermissionToUser(Long userId, PermissionName permissionName);


    void addPermissionToUser(String userName, PermissionName permissionName);

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

    // boolean hasWritePermission(String token);

    /*


    @Override
    public boolean hasWritePermission(String token) {
        // Extract username from token using JwtUtils
        JwtUtils jwtUtils = new JwtUtils(); // Create an instance of JwtUtils
        String userName = jwtUtils.getUsernameFromToken(token);

        if (userName == null) {
            // Handle invalid token or token without username
            return false;
        }

        try {
            // Fetch user from the database using username
            User user = findUserByUserName(userName);

            // Check if the user has WRITE permission
            return user.getUserPermissions().stream()
                    .anyMatch(permission -> permission.getPermissionName() == PermissionName.WRITE);
        } catch (EntityNotFoundException e) {
            // Handle scenario where user is not found
            System.err.println("User not found with username: " + userName);
            return false;
        }
    }*/
    //boolean hasPermission(String token, PermissionName permissionName);

    User getUserByEmail(String email);

    void updatePasswordByEmail(String email, String newPassword);

    int countUsersWithAdminRole();

    int countUsersWithRhRole();

    int countUsersWithUserRole();
}
