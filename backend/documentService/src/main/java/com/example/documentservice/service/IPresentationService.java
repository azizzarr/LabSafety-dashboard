package com.example.documentservice.service;

import com.example.documentservice.entities.Demande;
import com.example.documentservice.entities.Presentation;
import jakarta.servlet.http.HttpServletResponse;

public interface IPresentationService {
    Presentation addDemandeStage(Presentation presentation);

    Presentation addAttestationPresence(Presentation presentation);
    void retrieveDemandeStage(Long idPresentation, HttpServletResponse response);
    void retrieveAttestationPresence(Long idPresentation,HttpServletResponse response);

}
