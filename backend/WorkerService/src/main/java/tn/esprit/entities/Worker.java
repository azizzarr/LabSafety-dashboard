package tn.esprit.entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Worker {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long WorkerId;

    @Column(name = "matricule", nullable = false)
    private String matricule;
    @Column(name = "nom", nullable = false)
    private String nom;

    @Column(name = "prenom", nullable = false)
    private String prenom;

    @Column(name = "email", nullable = false, unique = true)
    private String email;




/*
    @ManyToMany(fetch = FetchType.EAGER)
  @Cascade({CascadeType.ALL}) // Using Hibernate's CascadeType array
    @JoinTable(name = "worker_postes",
            joinColumns = @JoinColumn(name = "worker_id", referencedColumnName = "WorkerId"),
            inverseJoinColumns = @JoinColumn(name = "poste_id", referencedColumnName = "PosteId"))
    private Set<Poste> postes;
*/



    @Column(name = "Date")
    private LocalDateTime date;

    @Column(name = "phone")
    private String phone;

    @Column(name = "charge_esd")
    private Long chargeEsd;
/*
    @OneToMany(mappedBy = "worker", cascade = CascadeType.PERSIST)
    private Set<Poste> postes = new HashSet<>();
*/
@ManyToMany
@JoinTable(
        name = "worker_postes",
        joinColumns = @JoinColumn(name = "worker_id"),
        inverseJoinColumns = @JoinColumn(name = "poste_id")
)
private Set<Poste> postes = new HashSet<>();
    @ManyToMany
    @JoinTable(
            name = "worker_services",
            joinColumns = @JoinColumn(name = "worker_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id")
    )
    private Set<ServiceWork> services = new HashSet<>();
}

