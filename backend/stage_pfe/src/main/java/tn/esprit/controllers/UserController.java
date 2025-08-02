package tn.esprit.controllers;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;
import tn.esprit.entities.Permission;
import tn.esprit.entities.PermissionName;
import tn.esprit.entities.User;
import tn.esprit.Interfaces.IUserService;
import tn.esprit.entities.UserPermission;
import tn.esprit.repositories.PermissionRepository;
import tn.esprit.repositories.UserPermissionRepository;
import tn.esprit.repositories.UserRepository;
import tn.esprit.security.jwtUtils.JwtUtils;
import tn.esprit.services.userDetails.UserDetailsServiceImpl;

import javax.persistence.EntityNotFoundException;
import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    IUserService userService;
    UserRepository userRepository;
    PermissionRepository permissionRepository;
    UserPermissionRepository userPermissionRepository;
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private JwtUtils jwtUtils;
    UserDetailsServiceImpl userDetailsService;

    @PostMapping("/addUser")
    public User add(@RequestBody User user) {
        return userService.saveUser(user);
    }

  /*  public ResponseEntity<Void> saveUser(@RequestBody User user) {
        userService.saveUser(user);
        return ResponseEntity.noContent().build();
    }
*/


    @PostMapping("updateUser/{userID}")
    @ResponseBody
    User updateUser(@RequestBody User user, @PathVariable Long userID) {
        return userService.updateUser(user, userID);
    }

    /*
    @PostMapping("updateUser/{userID}")
    @ResponseBody
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
        User user = userService.updateUser(userId, updatedUser);
        return ResponseEntity.ok(user);
    }
    */
    @GetMapping("/getRole")
    @ResponseBody
    public List<User> findAll() {
        return userService.getAllUsers();
    }


    @DeleteMapping("/delete/{userID}")
    public void deleteUserById(@PathVariable Long userID) {
        userService.deleteUser(userID);

    }

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, User user) {
        // get error status
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());

            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                return "error-404";
            } else if (statusCode == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
                return "error-500";
            }
        }

        return "error";
    }


    @PostMapping("/addPermissionToUser")
    public ResponseEntity<String> addPermissionToUser(@RequestBody Map<String, Object> request) {
        Long userId = Long.parseLong(request.get("userId").toString());
        String permissionName = request.get("permissionName").toString();

        PermissionName permissionEnum = PermissionName.valueOf(permissionName); // Convert string to enum

        userService.addPermissionToUser(userId, permissionEnum); // Pass enum to the service method

        return ResponseEntity.ok("Permission added successfully to user.");
    }


    @PostMapping("/addUserUser")
    public ResponseEntity<String> addUserUser(@RequestBody Map<String, Object> request) {
        try {
            // Extract the user object from the request
            User user = objectMapper.convertValue(request.get("user"), User.class);

            // Extract the permissionName from the request
            String permissionName = (String) request.get("permissionName");

            // Check if the user has the permission to add users
            if (!userService.hasPermission(user.getUserId(), PermissionName.valueOf(permissionName))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have the permission to add users");
            }

            // Save the user to the database
            userService.saveUser1(user);

            return ResponseEntity.ok("User added successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid permission name");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding the user");
        }
    }
    @PostMapping("/addUserIfHasPermission")
    public ResponseEntity<String> addUserIfHasPermission(@RequestBody Map<String, Object> request) {
        try {
            // Extract the user object from the request
            User user = objectMapper.convertValue(request.get("user"), User.class);

            // Extract the permissionName from the request
            String permissionName = (String) request.get("permissionName");

            // Check if the user has the permission to add users
            if (!userService.hasPermission(user.getUserId(), PermissionName.valueOf(permissionName))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have the permission to add users");
            }

            // Save the user to the database
            userService.addUserIfHasPermission(user, PermissionName.valueOf(permissionName));

            return ResponseEntity.ok("User added successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid permission name");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding the user");
        }
    }

    @PostMapping("/import")
    public ResponseEntity<String> importUsers(@RequestParam("filePath") String filePath) {
        try {
            List<User> users = userService.importUsersFromExcel(filePath);
            // Save users to the database
            // userService.saveAll(users);
            return ResponseEntity.ok("Users imported successfully.");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to import users: " + e.getMessage());
        }
    }
    @GetMapping("/export")
    public ResponseEntity<String> exportUsers(@RequestParam("filePath") String filePath) {
        try {
            userService.exportUsersToExcel(filePath);
            return ResponseEntity.ok("Users exported successfully.");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to export users: " + e.getMessage());
        }
    }
    @PostMapping("/email/{userId}")
    public ResponseEntity<String> sendPasswordResetEmail(@PathVariable("userId") Long userId) {
        logger.debug("Received request to send password reset email for user with ID: {}", userId);

        // Retrieve the user by userId
        User user = userService.getUserById(userId);
        if (user == null) {
            logger.debug("User not found for ID: {}", userId);
            return ResponseEntity.notFound().build();
        }

        logger.debug("User found: {}", user);

        // Generate reset token
        String resetToken = userService.generateResetToken(user);

        logger.debug("Reset token generated: {}", resetToken);

        // Generate reset password link with token and user ID
        String resetPasswordLink = "<html><body>"
                + "<h2>Reset Password</h2>"
                + "<form action=\"/api/reset-password/" + resetToken + "\" method=\"post\">"
                + "<input type=\"hidden\" name=\"userId\" value=\"" + userId + "\">"
                + "New Password: <input type=\"password\" name=\"password\"><br>"
                + "Confirm Password: <input type=\"password\" name=\"confirmPassword\"><br>"
                + "<input type=\"submit\" value=\"Reset Password\">"
                + "</form>"
                + "</body></html>";

        logger.debug("Reset password link generated: {}", resetPasswordLink);

        // Send password reset email
        userService.sendPasswordResetEmail(user.getEmail(), resetPasswordLink);

        logger.debug("Password reset email sent to: {}", user.getEmail());

        return ResponseEntity.ok("Password reset email sent successfully");
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> getUsersAsPdf() throws IOException, DocumentException {
        List<User> users = userService.getAllUsers();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter writer = PdfWriter.getInstance(document, baos);
        document.open();

        Font headingFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, BaseColor.BLACK);
        Paragraph heading = new Paragraph("List of Users", headingFont);
        heading.setAlignment(Element.ALIGN_CENTER);
        document.add(heading);
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{2, 3, 3, 2, 3});
        table.addCell("User ID");
        table.addCell("Username");
        table.addCell("Email");
        table.addCell("Phone");
        table.addCell("Birth Date");

        for (User user : users) {
            table.addCell(user.getUserId() != null ? user.getUserId().toString() : "");
            table.addCell(user.getUserName() != null ? user.getUserName() : "");
            table.addCell(user.getEmail() != null ? user.getEmail() : "");
            table.addCell(user.getPhone() != null ? user.getPhone() : "");
            table.addCell(user.getBirthDate() != null ? user.getBirthDate().toString() : "");
        }

        document.add(table);
        document.close();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "user_list.pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        ResponseEntity<byte[]> response = new ResponseEntity<>(baos.toByteArray(), headers, HttpStatus.OK);
        return response;
    }
    @PostMapping("/addUserIfHasPermissionn")
    public ResponseEntity<String> addUserIfHasPermission(@RequestBody Map<String, Object> request, @RequestHeader("Authorization") String token) {
        Logger logger = LoggerFactory.getLogger(UserController.class);

        try {
            // Log the received token
            logger.debug("Received token: {}", token);

            // Check if the token is null or empty
            if (token == null || token.isEmpty()) {
                logger.error("Token is null or empty");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is null or empty");
            }

            // Log the token before splitting
            logger.debug("Token before splitting: {}", token);

            // Split the token
            String[] tokenParts = token.split(" ");
            if (tokenParts.length != 2) {
                logger.error("Invalid token format: {}", token);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token format");
            }

            // Extract the token string
            String jwtToken = tokenParts[1];

            // Trim the token to remove leading and trailing spaces
            String trimmedToken = jwtToken.trim();
            logger.debug("Trimmed token: {}", trimmedToken);

            // Extract the user ID from the token
            Long userId = jwtUtils.getUserIdFromToken(trimmedToken);
            logger.debug("User ID extracted from token: {}", userId);

            // Extract the user object from the request
            User currentUser = userRepository.findById(userId).orElseThrow(() -> {
                logger.error("User not found: {}", userId);
                return new EntityNotFoundException("User not found");
            });

            // Extract the permissionName from the request body
            String permissionName = (String) request.get("permissionName");
            logger.debug("Permission name extracted from request: {}", permissionName);

            // Check if the user has the permission to add users
            if (!userService.hasPermission(currentUser.getUserId(), PermissionName.valueOf(permissionName))) {
                logger.error("User does not have permission to add users: {}", currentUser.getUserId());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have the permission to add users");
            }

            // Extract the user object from the request
            ObjectMapper objectMapper = new ObjectMapper();
            User userToAdd = objectMapper.convertValue(request.get("user"), User.class);

            // Save the user to the database
            userService.addUserIfHasPermission(userToAdd, PermissionName.valueOf(permissionName));

            logger.info("User added successfully: {}", userToAdd.getUserId());
            return ResponseEntity.ok("User added successfully");
        } catch (IllegalArgumentException e) {
            logger.error("Invalid permission name: {}", e.getMessage());
            logger.error("Permission name extracted from request: {}", request.get("permissionName"));
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid permission name");
        } catch (EntityNotFoundException e) {
            logger.error("User not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        } catch (Exception e) {
            // Log the exception stack trace
            logger.error("An error occurred while adding the user: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while adding the user");
        }
    }
    @PostMapping("/checkWritePermission")
    public ResponseEntity<String> checkWritePermission(@RequestHeader("Authorization") String token,@RequestBody User newUser) {
        // Logger initialization
        Logger logger = LoggerFactory.getLogger(getClass());

        try {
            // Check if the token is null or empty
            if (token == null || token.isEmpty()) {
                logger.error("Token is null or empty");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is null or empty");
            }

            // Log the received token
            logger.debug("Received token: {}", token);

            String jwtToken;

            // Check if the token starts with "Bearer "
            if (token.startsWith("Bearer ")) {
                // Extract the JWT token from the Authorization header
                jwtToken = token.substring(7).trim();
            } else {
                // Token format is invalid
                logger.error("Invalid token format: {}", token);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token format");
            }

            // Log the extracted token
            logger.debug("Extracted JWT token: {}", jwtToken);

            // Trim the token to remove leading and trailing spaces
            String trimmedToken = jwtToken.trim();
            logger.debug("Trimmed token: {}", trimmedToken);

            // Check if the trimmed token is empty
            if (trimmedToken.isEmpty()) {
                logger.error("Trimmed token is empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid token");
            }

            // Check if the user has WRITE permission
            boolean hasWritePermission = userService.hasWritePermission(trimmedToken);

            if (hasWritePermission) {
                logger.info("User has WRITE permission");
                userService.saveUser(newUser);

                logger.info("User added successfully");
                return ResponseEntity.ok("User added successfully");
            } else {
                logger.warn("User does not have WRITE permission");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User does not have WRITE permission");
            }
        } catch (Exception e) {
            logger.error("An error occurred while checking permission: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while checking permission");
        }
    }


}








