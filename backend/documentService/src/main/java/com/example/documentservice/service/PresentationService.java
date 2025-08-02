package com.example.documentservice.service;

import com.example.documentservice.dto.Student;
import com.example.documentservice.entities.Demande;
import com.example.documentservice.entities.Presentation;
import com.example.documentservice.repository.PresentationRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.PdfReader;
import com.itextpdf.kernel.pdf.canvas.parser.PdfTextExtractor;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import com.example.documentservice.dto.DataMapper;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;

@Service
public class PresentationService implements IPresentationService{

    @Autowired
    private PresentationRepository presentationRepository;
    @Autowired
    private DataMapper dataMapper;
    @Autowired
    private TemplateEngine templateEngine;
    @Autowired
    private CreatePdfService createPdfService;

    @Override
    public Presentation addDemandeStage(Presentation presentation) {
        String finalHtml= null;
        Student s= new Student("amine","ghandri");
        Context con= dataMapper.setData(s);
        finalHtml=templateEngine.process("DemandeStage",con);
        String name="demande_stage_"+s.firstname+"_"+ LocalDateTime.now()+".pdf";
        presentation.setPathFile(name);
        createPdfService.html2pdf(finalHtml,name);
        return presentationRepository.save(presentation);
    }

    @Override
    public Presentation addAttestationPresence(Presentation presentation) {
        String finalHtml= null;
        Student s= new Student("layth","ghandri");
        Context con= dataMapper.setData(s);
        finalHtml=templateEngine.process("AttestationPresence",con);
        String name="attestation_presence_"+s.firstname+"_"+ LocalDateTime.now()+".pdf";
        presentation.setPathFile(name);
        createPdfService.html2pdf(finalHtml,name);
        return presentationRepository.save(presentation);
    }


    @Override
    public void retrieveDemandeStage(Long idPresentation,HttpServletResponse response) {

        Presentation presentation= presentationRepository.findById(idPresentation).orElse(null);

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "inline; filename=your-pdf-file.pdf");

        try {
            FileInputStream fileInputStream = new FileInputStream("/Users/leith/personal/SandBox/Micro-Services/microservices-project/backend/documentService/src/main/resources/webapp/"+presentation.getPathFile());
            OutputStream out = response.getOutputStream();
            byte[] buffer = new byte[4096];
            int bytesRead;

            while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
            fileInputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void retrieveAttestationPresence(Long idPresentation,HttpServletResponse response) {

        Presentation presentation= presentationRepository.findById(idPresentation).orElse(null);

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "inline; filename=your-pdf-file.pdf");

        try {
            FileInputStream fileInputStream = new FileInputStream("/Users/leith/personal/SandBox/Micro-Services/microservices-project/backend/documentService/src/main/resources/webapp/"+presentation.getPathFile());
            OutputStream out = response.getOutputStream();
            byte[] buffer = new byte[4096];
            int bytesRead;

            while ((bytesRead = fileInputStream.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
            fileInputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
