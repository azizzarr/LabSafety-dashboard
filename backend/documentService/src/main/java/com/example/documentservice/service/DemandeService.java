package com.example.documentservice.service;

import com.example.documentservice.entities.Demande;
import com.example.documentservice.repository.DemandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DemandeService implements IDemandeService{

    @Autowired
    private DemandeRepository demandeRepository;
    @Override
    public Demande addDemande(Demande demande) {
        return demandeRepository.save(demande);
    }

    @Override
    public List<Demande> retrieveAllDemandes() {
        return demandeRepository.findAll();
    }

    @Override
    public Demande retrieveDemande(Long idDemande) {
        return demandeRepository.findById(idDemande).orElse(null);
    }

    @Override
    public List<Demande> retrieveDemandeByStudent(Long idStudent) {
        return null;
    }
}
