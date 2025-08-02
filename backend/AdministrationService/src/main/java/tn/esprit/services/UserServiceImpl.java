package tn.esprit.services;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import tn.esprit.entities.*;
import tn.esprit.Interfaces.IUserService;

import tn.esprit.repositories.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;


import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tn.esprit.security.jwtUtils.JwtUtils;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.persistence.EntityNotFoundException;

@Service
public class UserServiceImpl implements IUserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;

    private final RoleRepository roleRepository;

    private final UserPermissionRepository userPermissionRepository;
    PermissionName permissionNameEnum = PermissionName.READ;
    private final JavaMailSender javaMailSender;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuditLogRepository auditLogRepository;
    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository,

                           UserPermissionRepository userPermissionRepository, JavaMailSender javaMailSender,RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.userPermissionRepository = userPermissionRepository;
        this.javaMailSender = javaMailSender;
        this.roleRepository = roleRepository;
    }


    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


    @Override
    public String extractUsernameFromToken(String token) {
        try {
            if (token == null || token.isEmpty()) {
                throw new IllegalArgumentException("Token is null or empty");
            }

            String[] tokenParts = token.split(" ");
            if (tokenParts.length != 2) {
                throw new IllegalArgumentException("Invalid token format");
            }

            String jwtToken = tokenParts[1].trim();
            String username = jwtUtils.getUsernameFromToken(jwtToken);

            User currentUser = userRepository.findByUserName(username).orElseThrow(() ->
                    new EntityNotFoundException("User not found")
            );

            return currentUser.getUserName();
        } catch (Exception e) {
            logger.error("Error extracting username from token", e);
            throw new RuntimeException("Error extracting username from token", e);
        }
    }
   @Override
   public void logAction(String username, String action, String details) {
        AuditLog log = new AuditLog();
        log.setUsername(username);
        log.setAction(action);
        log.setDetails(details);
        log.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(log);
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }
/*
    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }*/
@Override
    public void deleteUser(Long userId, String token) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            user.setRoles(null); // Remove roles association
            userRepository.save(user); // Save the user without roles
            userRepository.deleteById(userId); // Delete the user
        }
    String username = extractUsernameFromToken(token);
    logAction(username, "Delete", "Deleted  a user with userId: " + user.getUserId());
    }

    @Override
    public User updateUser(User updatedUser, Long userId, String token) {
        String username = extractUsernameFromToken(token);

        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        logAction(username, "UPDATE", "Updated  a worker with userId: " + existingUser.getUserId());
        // Update the user's information
        existingUser.setUserName(updatedUser.getUserName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setPhone(updatedUser.getPhone());

        // Update other fields as needed

        return userRepository.save(existingUser);
    }

    @Override
    public List<User> getUsersByRoleRH() {
        // Query the repository to fetch users with the role "ROLE_RH"
        return userRepository.findByRolesName(ERole.ROLE_RH);
    }
    @Override
    public List<User> getUsersByRoleAdmin() {
        // Query the repository to fetch users with the role "ROLE_RH"
        return userRepository.findByRolesName(ERole.ROLE_ADMIN);
    }
    @Override
    public User findById(Long userId) {
        // Check if userId is null
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }


    @Override
    public void addPermissionToUser(Long userId, PermissionName permissionName) {
        // Fetch the user from the database based on the user ID
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Check if the user already has the permission
        boolean permissionExists = user.getUserPermissions().stream()
                .anyMatch(userPermission -> userPermission.getPermissionName().equals(permissionName));
        if (permissionExists) {
            throw new IllegalArgumentException("User already has the permission");
        }

        // Create a new UserPermission entity and set the user and permissionName
        UserPermission userPermission = new UserPermission();
        userPermission.setUser(user);
        userPermission.setPermissionName(permissionName);

        // Save the UserPermission entity to the database
        userPermissionRepository.save(userPermission);
    }
    @Override
    public void addPermissionToUser(String userName, PermissionName permissionName, String token) {
        // Fetch the user from the database based on the username
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new EntityNotFoundException("User not found with username: " + userName));

        // Check if the user already has the permission
        boolean permissionExists = user.getUserPermissions().stream()
                .anyMatch(userPermission -> userPermission.getPermissionName().equals(permissionName));
        if (permissionExists) {
            throw new IllegalArgumentException("User already has the permission");
        }

        // Create a new UserPermission entity and set the user and permissionName
        UserPermission userPermission = new UserPermission();
        userPermission.setUser(user);
        userPermission.setPermissionName(permissionName);

        // Save the UserPermission entity to the database
        userPermissionRepository.save(userPermission);

        // Determine the action based on the value of PermissionName
        String action;
        switch (permissionName) {
            case WRITE:
                action = "Write Permission";
                break;
            case DELETE:
                action = "Delete Permission";
                break;
            case UPDATE:
                action = "Update Permission";
                break;
            case IMPORT:
                action = "Import Permission";
                break;
            case READ:
                action = "Read Permission";
                break;
            default:
                action = "Unknown Permission";
                break;
        }

        String username = extractUsernameFromToken(token);
        logAction(username, "" + action, "added " + action + " to userId: " + user.getUserName());
    }




    @Override
    public boolean hasPermission(Long userId, PermissionName permissionName) {
        // Fetch the user from the database based on the user ID
        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Fetch the permission from the database based on the permission name
        Permission permission = permissionRepository.findByName(permissionName)
                .orElseThrow(() -> new EntityNotFoundException("Permission not found"));

        // Fetch the user's permissions from the database
        List<UserPermission> userPermissions = userPermissionRepository.findByUserAndPermissionName(user, permissionName);

        // Check if the user has the required permission
        return !userPermissions.isEmpty();
    }


    @Override
    public User saveUser1(User user) {
        // Check if the user has the permission to add users
        if (!hasPermission(user.getUserId(), PermissionName.WRITE)) {
            throw new IllegalArgumentException("User does not have the permission to add users");
        }

        // Save the user to the database
        return userRepository.save(user);
    }
/*
    @Override
    public void addUserIfHasPermission(User user, PermissionName permissionName) {
        // Fetch the permission from the database based on the permission name
        Permission permission = permissionRepository.findByName(permissionName)
                .orElseThrow(() -> new EntityNotFoundException("Permission not found"));

        // Check if the user already has the permission
        List<UserPermission> existingPermissions = userPermissionRepository.findByUserAndPermission(user, permission);
        if (!existingPermissions.isEmpty()) {
            // User already has the permission, so add the user
            userRepository.save(user);
        } else {
            throw new IllegalArgumentException("User does not have the required permission");
        }
    }
    */

   /* @Override
    public void addUserIfHasPermission(User user, PermissionName permissionName) {
        // Fetch the permission from the database based on the permission name
        Permission permission = permissionRepository.findByName(permissionName)
                .orElseThrow(() -> new EntityNotFoundException("Permission not found"));

        // Check if the user already has the permission
        List<UserPermission> existingPermissions = userPermissionRepository.findByUserAndPermission(user, permission);
        if (!existingPermissions.isEmpty()) {
            // User already has the permission, so create a new user with the same properties
            User newUser = new User();
            BeanUtils.copyProperties(user, newUser);
            // Set userId to null to generate a new userId
            newUser.setUserId(null);
            // Add other properties as needed
            userRepository.save(newUser);
        } else {
            throw new IllegalArgumentException("User does not have the required permission");
        }
    }
*/

    @Override
    public void addUserIfHasPermission(User user, PermissionName permissionName) {
        // Fetch the permission from the database based on the permission name
        Permission permission = permissionRepository.findByName(permissionName)
                .orElseThrow(() -> new EntityNotFoundException("Permission not found"));

        // Check if the user already has the permission
        List<UserPermission> existingPermissions = userPermissionRepository.findByUserAndPermissionName(user, permissionName);
        if (existingPermissions.isEmpty()) {
            // User doesn't have the permission, so proceed to save
            if (!userRepository.existsByUserId(user.getUserId())) {
                // Encode the password
                String encode = passwordEncoder.encode(user.getPassword());
                // Set the encoded password
                user.setPassword(encode);
                // Save the user
                userRepository.save(user);
            }
        } else {
            // User already has the permission, throw an exception
            throw new IllegalArgumentException("User already has the required permission");
        }
    }


    boolean getCellBooleanValue(Cell cell) {
        if (cell == null) {
            return false;
        }

        switch (cell.getCellType()) {
            case BOOLEAN:
                return cell.getBooleanCellValue();
            case NUMERIC:
                // Convert numeric value to boolean
                return cell.getNumericCellValue() == 1;
            default:
                return false;
        }
    }

    String getCellStringValue(Cell cell) {
        if (cell == null) {
            return null;
        }

        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    // Handle date cell type
                    return cell.getDateCellValue().toString();
                } else {
                    // Convert numeric value to string
                    return String.valueOf(cell.getNumericCellValue());
                }
            case BOOLEAN:
                // Convert boolean value to string
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return null;
        }
    }

    @Override
    public User findUserById(long userId) {
        return userRepository.findById(userId).orElse(null);
    }


    @Override
    public List<User> importUsersFromExcel(String filePath) throws IOException {
        List<User> usersToAdd = new ArrayList<>();
        List<User> usersAdded = new ArrayList<>();

        // Use try-with-resources to ensure FileInputStream is closed after use
        try (FileInputStream fileInputStream = new FileInputStream(filePath);
             Workbook workbook = WorkbookFactory.create(fileInputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<org.apache.poi.ss.usermodel.Row> rowIterator = sheet.iterator();

            // Skip the header row
            if (rowIterator.hasNext()) {
                rowIterator.next(); // Move to the next row
            }

            while (rowIterator.hasNext()) {
                org.apache.poi.ss.usermodel.Row row = rowIterator.next();

                long userId = (long) row.getCell(0).getNumericCellValue();

                // Check if the user with the same user_id already exists in the list of users added
                boolean userExists = usersAdded.stream().anyMatch(user -> user.getUserId() == userId);

                if (userExists) {
                    // User already exists in the list of users added, skip adding it
                    System.out.println("User with user_id " + userId + " already exists in the list of users added.");
                } else {
                    // Check if the user with the same user_id already exists in the database
                    User existingUser = findUserById(userId);

                    if (existingUser != null) {
                        // User already exists in the database, skip adding it
                        System.out.println("User with user_id " + userId + " already exists in the database.");
                    } else {
                        // User does not exist, create a new user and add it to the list of users to be added
                        User user = new User();
                        user.setUserId(userId);
                        user.setAccountNonExpired(getCellBooleanValue(row.getCell(1))); // Account non expired
                        user.setAccountNonLocked(getCellBooleanValue(row.getCell(2))); // Account non locked
                        user.setBirthDate(row.getCell(3).getDateCellValue()); // Birth date
                        user.setCredentialsNonExpired(getCellBooleanValue(row.getCell(4))); // Credentials non expired
                        user.setEmail(getCellStringValue(row.getCell(5))); // Email
                        user.setEnabled(getCellBooleanValue(row.getCell(6))); // Enabled

                        // Encode the password before setting it to the user object
                        String rawPassword = getCellStringValue(row.getCell(7));
                        String encodedPassword = passwordEncoder.encode(rawPassword);
                        user.setPassword(encodedPassword);

                        user.setPhone(getCellStringValue(row.getCell(8))); // Phone
                        user.setUserName(getCellStringValue(row.getCell(9))); // User name

                        // Add the user to the list of users to be added
                        usersToAdd.add(user);
                        // Add the user to the list of users added to prevent duplicates
                        usersAdded.add(user);
                    }
                }
            }

            // Save the users to the database using the existing saveUser method
            List<User> savedUsers = usersToAdd.stream().map(this::saveUser).collect(Collectors.toList());

            return savedUsers;
        }
    }

/*
    @Override
    public void exportUsersToExcel(String filePath) throws IOException {
        // Query all users from the database
        List<User> users = getAllUsers();

        // Create a new workbook
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Users");

            // Write header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("user_id");
            headerRow.createCell(1).setCellValue("account_non_expired");
            headerRow.createCell(2).setCellValue("account_non_locked");
            headerRow.createCell(3).setCellValue("birth_date");
            headerRow.createCell(4).setCellValue("credentials_non_expired");
            headerRow.createCell(5).setCellValue("email");
            headerRow.createCell(6).setCellValue("enabled");
            headerRow.createCell(7).setCellValue("password");
            headerRow.createCell(8).setCellValue("phone");
            headerRow.createCell(9).setCellValue("user_name");

            // Write user data rows
            int rowNum = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(user.getUserId());
                row.createCell(1).setCellValue(user.isAccountNonExpired());
                row.createCell(2).setCellValue(user.isAccountNonLocked());

                // Check if birth date is null
                if (user.getBirthDate() != null) {
                    row.createCell(3).setCellValue(user.getBirthDate().toString());
                } else {
                    row.createCell(3).setCellValue(""); // Or set a default value
                }

                row.createCell(4).setCellValue(user.isCredentialsNonExpired());
                row.createCell(5).setCellValue(user.getEmail());
                row.createCell(6).setCellValue(user.isEnabled());
                row.createCell(7).setCellValue(user.getPassword());
                row.createCell(8).setCellValue(user.getPhone());
                row.createCell(9).setCellValue(user.getUserName());
            }

            // Write the workbook to the file
            try (FileOutputStream fileOut = new FileOutputStream(filePath)) {
                workbook.write(fileOut);
            }
        }
    }
*/
@Override
public void exportUsersToExcel(String filePath) throws IOException {

    // Query all users from the database
    List<User> users = getAllUsers();

    // Create a new workbook
    try (Workbook workbook = new XSSFWorkbook()) {
        Sheet sheet = workbook.createSheet("Users");

        // Write header row
        Row headerRow = sheet.createRow(0);
        headerRow.createCell(0).setCellValue("user_id");
        headerRow.createCell(1).setCellValue("account_non_expired");
        headerRow.createCell(2).setCellValue("account_non_locked");
        headerRow.createCell(3).setCellValue("birth_date");
        headerRow.createCell(4).setCellValue("credentials_non_expired");
        headerRow.createCell(5).setCellValue("email");
        headerRow.createCell(6).setCellValue("enabled");
        headerRow.createCell(7).setCellValue("password");
        headerRow.createCell(8).setCellValue("phone");
        headerRow.createCell(9).setCellValue("user_name");

        // Write user data rows
        int rowNum = 1;
        for (User user : users) {
            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(user.getUserId());
            row.createCell(1).setCellValue(user.isAccountNonExpired());
            row.createCell(2).setCellValue(user.isAccountNonLocked());

            // Check if birth date is null
            if (user.getBirthDate() != null) {
                row.createCell(3).setCellValue(user.getBirthDate().toString());
            } else {
                row.createCell(3).setCellValue(""); // Or set a default value
            }

            row.createCell(4).setCellValue(user.isCredentialsNonExpired());
            row.createCell(5).setCellValue(user.getEmail());
            row.createCell(6).setCellValue(user.isEnabled());
            row.createCell(7).setCellValue(user.getPassword());
            row.createCell(8).setCellValue(user.getPhone());
            row.createCell(9).setCellValue(user.getUserName());
        }

        // Write the workbook to the file
        try (FileOutputStream fileOut = new FileOutputStream(new File(filePath))) {
            workbook.write(fileOut);
        }
    }
}

    @Override
    public void initiatePasswordReset(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            String email = user.getEmail();
            String resetToken = jwtUtils.generateResetToken(user); // Generate reset token
            user.setResetToken(resetToken);
            userRepository.save(user);
            String resetPasswordLink = "<html><body>"
                    + "<h2>Reset Password</h2>"
                    + "<form action=\"/api/reset-password/" + resetToken + "\" method=\"post\">"
                    + "New Password: <input type=\"password\" name=\"password\"><br>"
                    + "Confirm Password: <input type=\"password\" name=\"confirmPassword\"><br>"
                    + "<input type=\"submit\" value=\"Reset Password\">"
                    + "</form>"
                    + "</body></html>";
            sendPasswordResetEmail(email, resetPasswordLink); // Send email with reset token
        }
    }


    @Override
    public void enableTwoFactorAuth(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            String twoFactorAuthCode = jwtUtils.generateTwoFactorAuthCode(user); // Generate 2FA code
            user.setTwoFactorAuthCode(twoFactorAuthCode);
            userRepository.save(user);
            sendTwoFactorAuthCodeEmail(email, twoFactorAuthCode); // Send email with 2FA code
        }
    }

    @Override
    public boolean validatePasswordResetToken(String email, String token) {
        User user = userRepository.findByEmailAndResetToken(email, token);
        return user != null;
    }


    // Utility method to generate 2FA code
    @Override
    public String generateTwoFactorAuthCode() {
        // Define characters allowed in the code
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        // Define length of the code
        int length = 6;

        // Initialize secure random number generator
        SecureRandom random = new SecureRandom();

        // StringBuilder to store the generated code
        StringBuilder code = new StringBuilder();

        // Generate code of specified length
        for (int i = 0; i < length; i++) {
            // Generate random index to select a character from the 'characters' string
            int randomIndex = random.nextInt(characters.length());

            // Append selected character to the code
            code.append(characters.charAt(randomIndex));
        }

        // Return the generated code
        return code.toString();
    }

 /*   @Override
    public void sendPasswordResetEmail(String email, String resetToken) {
        // Implement logic to send an email to the user's email address
        // The email should contain the reset token for password reset

        // Example implementation using JavaMailSender
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset");
        message.setText("Your password reset token is: " + resetToken);
        javaMailSender.send(message);
    }*/
 public void sendPasswordResetEmail(String email, String resetPasswordLink) {
     String subject = "Password Reset Request";
     String content = "<html>" +
             "<head>" +
             "<style>" +
             "  body {" +
             "    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;" +
             "    background-color: #f9f9f9;" +
             "    margin: 0;" +
             "    padding: 0;" +
             "  }" +
             "  .email-container {" +
             "    max-width: 700px;" +
             "    margin: 40px auto;" +
             "    background-color: #ffffff;" +
             "    border: 1px solid #e0e0e0;" +
             "    border-radius: 10px;" +
             "    overflow: hidden;" +
             "    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);" +
             "  }" +
             "  .email-header {" +
             "    background: linear-gradient(90deg, #6a11cb 0%, #2575fc 100%);" +
             "    color: #ffffff;" +
             "    padding: 30px;" +
             "    text-align: center;" +
             "  }" +
             "  .email-header h1 {" +
             "    margin: 0;" +
             "    font-size: 24px;" +
             "  }" +
             "  .email-body {" +
             "    padding: 40px;" +
             "    color: #333333;" +
             "    font-size: 16px;" +
             "    line-height: 1.5;" +
             "  }" +
             "  .email-footer {" +
             "    background-color: #f9f9f9;" +
             "    padding: 20px;" +
             "    text-align: center;" +
             "    font-size: 12px;" +
             "    color: #888888;" +
             "  }" +
             "  .reset-link {" +
             "    display: inline-block;" +
             "    padding: 15px 30px;" +
             "    margin: 20px 0;" +
             "    background-color: #2575fc;" +
             "    color: #ffffff;" +
             "    text-decoration: none;" +
             "    border-radius: 25px;" +
             "    font-weight: bold;" +
             "    box-shadow: 0 2px 10px rgba(37, 117, 252, 0.3);" +
             "    transition: background-color 0.3s, box-shadow 0.3s;" +
             "  }" +
             "  .reset-link:hover {" +
             "    background-color: #6a11cb;" +
             "    box-shadow: 0 4px 20px rgba(37, 117, 252, 0.5);" +
             "  }" +
             "</style>" +
             "</head>" +
             "<body>" +
             "<div class=\"email-container\">" +
             "  <div class=\"email-header\">" +
             "    <h1>Password Reset</h1>" +
             "  </div>" +
             "  <div class=\"email-body\">" +
             "    <p>Hello,</p>" +
             "    <p>You requested to reset your password. Please click the link below to reset your password:</p>" +
             "    <a href=\"" + resetPasswordLink + "\" class=\"reset-link\">Reset Password</a>" +
             "    <p>If you did not request a password reset, please ignore this email.</p>" +
             "    <p>Thank you,<br>Your Company</p>" +
             "  </div>" +
             "  <div class=\"email-footer\">" +
             "    <p>&copy; 2024 Sagemcom. All rights reserved.</p>" +
             "  </div>" +
             "</div>" +
             "</body>" +
             "</html>";

     sendHtmlEmail(email, subject, content);
 }


    private void sendHtmlEmail(String to, String subject, String content) {
        MimeMessage message = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content, true); // Set to true to send HTML content

            javaMailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            // Handle the exception as needed
        }
    }

    @Override
    public void sendTwoFactorAuthCodeEmail(String email, String twoFactorAuthCode) {
        // Implement logic to send an email to the user's email address
        // The email should contain the 2FA code

        // Example implementation using JavaMailSender
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Two-Factor Authentication Code");
        message.setText("Your two-factor authentication code is: " + twoFactorAuthCode);
        javaMailSender.send(message);
    }

    @Override
    public String generateResetToken(User user) {
        // Generate a reset token based on user information
        // Example: return a random string or a hashed value combining user details
        // You can use libraries like UUID.randomUUID() to generate a random token
        return UUID.randomUUID().toString();
    }

    @Override
    public void updatePassword(User user, String newPassword) {
        // Encode the new password before updating
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }
    @Override
    public User findUserByUserName(String userName) {
        return userRepository.findByUserName(userName)
                .orElseThrow(() -> new EntityNotFoundException("User not found with username: " + userName));
    }
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
    @Override
    public boolean hasPermission(String token, PermissionName permissionName) {
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

            // Check if the user has the specified permission
            return user.getUserPermissions().stream()
                    .anyMatch(permission -> permission.getPermissionName() == permissionName);
        } catch (EntityNotFoundException e) {
            // Handle scenario where user is not found
            System.err.println("User not found with username: " + userName);
            return false;
        }
    }

    @Override
    public User getUserByEmail(String email) {
        // Implement your logic to retrieve the user by email from the database
        // For example, if you're using JPA repository, you can use a method like findByEmail
        // Assuming you have a UserRepository injected in your service
        return userRepository.findByEmail(email);
    }
    @Override
    public void updatePasswordByEmail(String email, String newPassword, String token) {
        String username = extractUsernameFromToken(token);

        // Retrieve the user by email
        User user = userRepository.findByEmail(email);
        logAction(username, "Email Reset password", "this user updated his password from email : " + user.getUserName());
        if (user != null) {
            // Update the password
            user.setPassword(newPassword);
            // Save the updated user
            userRepository.save(user);
        } else {
            throw new EntityNotFoundException("User not found for email: " + email);
        }
    }
    @Override
    public Set<UserPermission> getUserPermissionsByUserName(String userName) {
        Optional<User> userOptional = userRepository.findByUserName(userName);
        return userOptional.map(User::getUserPermissions).orElseGet(Collections::emptySet);
    }
    @Override
    public int countUsersWithAdminRole() {
        // Fetch the ROLE_ADMIN from the database
        Optional<Role> adminRole = roleRepository.findByName(ERole.ROLE_ADMIN);

        if (adminRole == null) {
            throw new RuntimeException("ROLE_ADMIN not found in the database");
        }

        return userRepository.countUsersByRolesContains(adminRole);
}
    @Override
    public int countUsersWithRhRole() {
        // Fetch the ROLE_ADMIN from the database
        Optional<Role> rhRole = roleRepository.findByName(ERole.ROLE_RH);

        if (rhRole == null) {
            throw new RuntimeException("ROLE_RHQ not found in the database");
        }

        return userRepository.countUsersByRolesContains(rhRole);
    }
    @Override
    public int countUsersWithUserRole() {
        // Fetch the ROLE_ADMIN from the database
        Optional<Role> userRole = roleRepository.findByName(ERole.ROLE_USER);

        if (userRole == null) {
            throw new RuntimeException("ROLE_USER not found in the database");
        }

        return userRepository.countUsersByRolesContains(userRole);
    }
}







// Method to update an existing user permission


/*
    public UserPermission updatePermission(User grantor, User grantee, Permission permission) {
        Optional<UserPermission> existingPermissionOptional = userPermissionRepository.findByGrantorAndGranteeAndPermission(grantor, grantee, permission);
        if (existingPermissionOptional.isPresent()) {
            UserPermission existingPermission = existingPermissionOptional.get();
            existingPermission.setPermission(permission);
            return userPermissionRepository.save(existingPermission);
        } else {
            // Handle the case where the permission doesn't exist
            throw new RuntimeException("Permission does not exist.");
        }
    }

*/
/*
    // Method to delete an existing user permission
    public void deletePermission(User grantor, User grantee, Permission permission) {
        Optional<UserPermission> existingPermissionOptional = userPermissionRepository.findByGrantorAndGranteeAndPermissionType(grantor, grantee, permission);
        if (existingPermissionOptional.isPresent()) {
            userPermissionRepository.delete(existingPermissionOptional.get());
        } else {
            // Handle the case where the permission doesn't exist
            throw new RuntimeException("Permission does not exist.");
        }
    }
*/
    // Method to find all permissions granted by a user
  /*  public List<UserPermission> findAllPermissionsGrantedByUser(User grantor) {
        return userPermissionRepository.findByGrantor(grantor);
    }

    // Method to find all permissions granted to a user
    public List<UserPermission> findAllPermissionsGrantedToUser(User grantee) {
        return userPermissionRepository.findByGrantee(grantee);
    }*/




