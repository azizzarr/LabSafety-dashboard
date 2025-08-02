package tn.esprit.entities;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Setter
@Getter
@Entity
@Table(name = "Services")

public class ServiceWork {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ServiceWorkId;

    @Enumerated(EnumType.STRING)
    // @Column(length = 60)
    private Enumservice name; // You can add additional fields if needed
}
