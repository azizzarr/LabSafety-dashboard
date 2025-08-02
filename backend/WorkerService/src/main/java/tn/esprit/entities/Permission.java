package tn.esprit.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "permission")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
/*
    @Column(name = "name", nullable = false, unique = true)
    private String name;
    */
@Column(name = "name", nullable = false, unique = true)
@Enumerated(EnumType.STRING) // Ensure correct mapping for PermissionName enum
private PermissionName name;


    // Other fields and methods as needed
}
