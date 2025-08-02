package tn.esprit.springjwt.payload.request;

import java.time.LocalDate;
import java.util.Date;
import java.util.Set;


public class SignupRequest {
 
  private String username;
    private Date birthDate;
 String email;
    //String poste;
    private Set<String> roles;


  private String password;
    private String phone;

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }


    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

  public String getEmail() {
    return email;
  }
    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }



}