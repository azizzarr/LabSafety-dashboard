package tn.esprit.security.jwtUtils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import tn.esprit.entities.User;

import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.SecureRandom;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Component
public class JwtUtils implements Serializable {
    @Value("${jwt.refreshToken.secret}")
    private String refreshTokenSecretKey;
    private static final long serialVersionUID = -2550185165626007488L;

    public static final long JWT_TOKEN_VALIDITY = 7 * 24 * 60 * 60;

    private Key secretKey = Keys.hmacShaKeyFor("AEAFEGAEGRZFeaaegagAFAefaZGZEGZRHRZGFHZZR11111".getBytes(StandardCharsets.UTF_8));


    // retrieve username from jwt token
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // retrieve expiration date from jwt token
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    // for retrieving any information from token we will need the secret key
    private Claims getAllClaimsFromToken(String token) {
        Jws<Claims> jwsClaims = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
        return jwsClaims.getBody();
    }

    // check if the token has expired
    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    // generate token for user
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, userDetails.getUsername());
    }

    // while creating the token -
    // 1. Define claims of the token, like Issuer, Expiration, Subject, and the ID
    // 2. Sign the JWT using the HS512 algorithm and secret key.
    // 3. According to JWS Compact Serialization(https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41#section-3.1)
    // compaction of the JWT to a URL-safe string
    private String doGenerateToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + JWT_TOKEN_VALIDITY * 1000);
        String utc = now.toInstant().atZone(ZoneId.of("UTC")).format(DateTimeFormatter.ISO_DATE_TIME);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .claim("utc", utc) // add the UTC timezone as a claim
                .signWith(secretKey)
                .compact();
    }

    // validate token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean validateRefreshToken(String refreshToken) {
        try {
            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(refreshTokenSecretKey)
                    .build()
                    .parseClaimsJws(refreshToken);

            if (!claims.getBody().getSubject().equals("refreshToken")) {
                return false;
            }

            Date expiration = claims.getBody().getExpiration();
            return !expiration.before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    public String generateTwoFactorAuthCode(User user) {
        // Generate a random 6-digit code
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
    public String generateResetToken(User user) {
        // Generate a random UUID as the reset token
        return UUID.randomUUID().toString();
    }

    public Long getUserIdFromToken(String token) {
        // Trim the token to remove leading and trailing spaces
        String trimmedToken = token.trim();

        try {
            // Parse the trimmed token
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(trimmedToken)
                    .getBody();

            // Extract subject from claims
            String subject = claims.getSubject();

            // Check if subject is null or empty
            if (subject == null || subject.isEmpty()) {
                throw new IllegalArgumentException("Token does not contain a valid user ID");
            }

            // Parse subject to Long
            return Long.parseLong(subject);
        } catch (NumberFormatException e) {
            // Handle NumberFormatException separately
            System.err.println("Error parsing user ID: " + e.getMessage());
            return null; // Or throw a custom exception if needed
        } catch (JwtException | IllegalArgumentException e) {
            // Handle other exceptions
            System.err.println("Error parsing token: " + e.getMessage());
            return null; // Or throw a custom exception if needed
        }
    }



    public static Long extractUserIdFromToken(String token) {
        JwtUtils jwtUtils = new JwtUtils(); // Create an instance of JwtUtils
        return jwtUtils.getUserIdFromToken(token); // Call the instance method to extract the user ID
    }


}
