package tn.esprit.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.FieldDefaults;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;


@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@ToString
@Getter
@Setter

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Data
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"username"}),
        @UniqueConstraint(columnNames = {"email"})
})
public class User implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String userName;
    private String password;

    private String phone;
    private String email;
    private Date birthDate;

    private boolean accountNonExpired = true;

    private boolean accountNonLocked = true;

    private boolean credentialsNonExpired = true;

    private boolean enabled = true;
    private String resetToken;
    private String twoFactorAuthCode;
/*
    public User(String username, String email, String password,String phone) {
        this.userName = username;
        this.email = email;
        this.password = password;
        this.phone = phone;
    }
*/
    public User(String username, String email, String encode,Date birthDate, String phone) {
        this.userName = username;
        this.email = email;
        this.password = encode;
        this.birthDate = birthDate;
        this.phone = phone;
    }


    public String getPhone() {
        return String.valueOf(phone);
    }
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "userId"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "roleId"))
    private Set<Role> roles;


    /*@ManyToMany(mappedBy = "users")
    private Set<Events> events = new HashSet<>();
  /* @JsonIgnore
   @ManyToMany( cascade = CascadeType.ALL)
   private Set<Events> Evenements;
    @OneToMany(mappedBy="ratingOwner", fetch= FetchType.LAZY, cascade=CascadeType.ALL)
    private List<Rating> listRatings;
*/
    @OneToMany(mappedBy = "user")
    private Set<UserPermission> userPermissions = new HashSet<>();



    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public void setTwoFactorAuthCode(String twoFactorAuthCode) {
        this.twoFactorAuthCode = twoFactorAuthCode;
    }

}