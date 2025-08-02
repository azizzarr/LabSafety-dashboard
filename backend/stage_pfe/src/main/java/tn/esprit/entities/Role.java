package tn.esprit.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;


@Setter
@Getter
@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId;



    @Enumerated(EnumType.STRING)
   // @Column(length = 60)
    private ERole name;
}
