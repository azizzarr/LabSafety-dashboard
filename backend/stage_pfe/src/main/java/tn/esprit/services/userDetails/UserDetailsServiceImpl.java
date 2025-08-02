package tn.esprit.services.userDetails;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import tn.esprit.entities.User;
import tn.esprit.repositories.UserRepository;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<User> user = userRepository.findByUserName(username);
        if (!user.isPresent()) {
            throw new UsernameNotFoundException("user name not found");
        }

        User actUser = user.get();





        return new org.springframework.security.core.userdetails.User(
                actUser.getUserName(),
                actUser.getPassword(),
                actUser.isEnabled(),
                actUser.isAccountNonExpired(),
                actUser.isCredentialsNonExpired(),
                actUser.isAccountNonLocked(),
                actUser.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getName().toString())).collect(Collectors.toList())

        );
    }

        public User updateUser(Long userId, User updatedUser) {
            User existingUser = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update the user's information
            existingUser.setUserName(updatedUser.getUserName());
            existingUser.setEmail(updatedUser.getEmail());
            // Update other fields as needed

            return userRepository.save(existingUser);
        }


}


