package com.example.documentservice.service;

import com.example.documentservice.entities.Demande;

import java.util.List;

public interface IDemandeService {
    Demande addDemande(Demande demande);
    List<Demande> retrieveAllDemandes();
    Demande retrieveDemande(Long idDemande);
    List<Demande> retrieveDemandeByStudent(Long idStudent);
}
