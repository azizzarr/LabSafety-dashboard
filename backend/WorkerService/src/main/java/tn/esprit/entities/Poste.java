package tn.esprit.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@Entity
@Table(name = "Postes")
public class Poste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long PosteId;

    @Enumerated(EnumType.STRING)
    // @Column(length = 60)
    private Enumposte name; // You can add additional fields if needed

/*
    @ManyToOne
    @JoinColumn(name = "worker_id")
    private Worker worker;
*/
/*@ManyToMany(mappedBy = "postes")
private Set<Worker> workers = new HashSet<>();*/
}