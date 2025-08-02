package tn.esprit.controllers;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.web.bind.annotation.*;

import tn.esprit.Interfaces.IUserService;
import tn.esprit.entities.AuditLog;
import tn.esprit.entities.ERole;
import tn.esprit.entities.Role;
import tn.esprit.entities.User;
import tn.esprit.repositories.AuditLogRepository;
import tn.esprit.repositories.RoleRepository;
import tn.esprit.repositories.UserRepository;

import tn.esprit.security.jwtUtils.JwtUtils;
import tn.esprit.springjwt.payload.request.LoginRequest;
import tn.esprit.springjwt.payload.request.SignupRequest;
import tn.esprit.springjwt.payload.response.JwtResponse;
import tn.esprit.springjwt.payload.response.MessageResponse;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuditLogRepository auditLogRepository;
    @Autowired
    IUserService userService;
    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
        } catch (Exception e) {
            throw new Exception("Bad credentials");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        final String jwtToken = jwtUtils.generateToken(userDetails);

        // Log the authentication action
       userService.logAction(loginRequest.getUsername(), "Login", "User logged in successfully");

        return ResponseEntity.ok(new JwtResponse(userDetails.getUsername(), jwtToken));
    }


    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUserName(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()), signUpRequest.getPhone(),signUpRequest.getBirthDate());

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Role is required!"));
        }

        strRoles.forEach(role -> {
            switch (role) {
                case "ROLE_ADMIN":
                    Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(adminRole);
                    break;
                case "ROLE_EMPLOYE":
                    Role employeeRole = roleRepository.findByName(ERole.ROLE_EMPLOYE)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(employeeRole);
                    break;
                case "ROLE_RH":
                    Role rhRole = roleRepository.findByName(ERole.ROLE_RH)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(rhRole);
                    break;
                case "ROLE_USER":
                    Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                    roles.add(userRole);
                    break;
                // Add other cases for different roles as needed
                default:
                    throw new RuntimeException("Error: Unknown role '" + role + "'.");
            }
        });

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }


    @PostMapping("/refreshToken")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        if (jwtUtils.validateRefreshToken(refreshToken)) {
            String username = jwtUtils.getUsernameFromToken(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            String newToken = jwtUtils.generateToken(userDetails);
            return ResponseEntity.ok(new HashMap<String, String>() {{
                put("token", newToken);
            }});
        } else {
            return ResponseEntity.badRequest().build();
        }
    }



    }

