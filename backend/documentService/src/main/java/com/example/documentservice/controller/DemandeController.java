package com.example.documentservice.controller;

import com.example.documentservice.entities.Demande;
import com.example.documentservice.service.IDemandeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/demande")
public class DemandeController {
    @Autowired
    private IDemandeService iDemandeService;
    @PostMapping("/add")
    public Demande addDemande(@RequestBody Demande demande){
        return  iDemandeService.addDemande(demande);
    }
}
