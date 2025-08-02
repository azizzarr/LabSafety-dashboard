package tn.esprit.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;

@Setter
@Getter
@Entity
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "prenom", nullable = false)
    private String prenom;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "poste")
    private String poste;

    @Column(name = "birthdate")
    private LocalDate birthdate;

    @Column(name = "phone")
    private String phone;

    @Column(name = "charge_esd")
    private Long chargeEsd;


}

