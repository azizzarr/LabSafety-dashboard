package com.example.documentservice.controller;

import com.example.documentservice.dto.DataMapper;
import com.example.documentservice.dto.Student;
import com.example.documentservice.entities.Presentation;
import com.example.documentservice.service.CreatePdfService;
import com.example.documentservice.service.IPresentationService;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.resolver.font.DefaultFontProvider;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.ISpringTemplateEngine;
import org.thymeleaf.TemplateEngine;

import java.io.*;
import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/doc")
public class PresentationController {
    @Autowired
    private CreatePdfService createPdfService;
    @Autowired
    private TemplateEngine templateEngine;
    @Autowired
    private DataMapper dataMapper;
    @Autowired
    private IPresentationService iPresentationService;
    @PostMapping("/generatedemandestage")
    public String createPdf(@RequestBody Presentation presentation){
        iPresentationService.addDemandeStage(presentation);
        return "seccess";
    }

    @PostMapping("/generateattestationpresence")
    public String createatt(@RequestBody Presentation presentation){
        iPresentationService.addAttestationPresence(presentation);
        return "seccess";
    }

    @GetMapping("/show-pdf/{idPresentation}")
    public void showPdf(@PathVariable("idPresentation") Long idPresentation,HttpServletResponse response){
        iPresentationService.retrieveDemandeStage(idPresentation,response);
    }

    @GetMapping("/show-pdf-att/{idPresentation}")
    public void showPdfAtt(@PathVariable("idPresentation") Long idPresentation,HttpServletResponse response){
        iPresentationService.retrieveAttestationPresence(idPresentation,response);
    }






}
