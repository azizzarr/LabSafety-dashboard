package com.example.documentservice.service;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;

import com.itextpdf.html2pdf.resolver.font.DefaultFontProvider;
import com.itextpdf.kernel.pdf.PdfWriter;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;


@Service
public class CreatePdfService {
    public String html2pdf(String html, String filename){
        ByteArrayOutputStream byteArrayOutputStream= new ByteArrayOutputStream();
        try{
            PdfWriter writer = new PdfWriter(byteArrayOutputStream);
            DefaultFontProvider defaultFontProvider= new DefaultFontProvider();
            defaultFontProvider.addDirectory("/Users/leith/personal/SandBox/Micro-Services/microservices-project/backend/documentService/src/main/resources/fonts");
            defaultFontProvider.addFont("/Users/leith/personal/SandBox/Micro-Services/microservices-project/backend/documentService/src/main/resources/fonts/BebasNeue-Regular.ttf");
            ConverterProperties converterProperties= new ConverterProperties().setFontProvider(defaultFontProvider);
            HtmlConverter.convertToPdf(html,writer,converterProperties);
            FileOutputStream fout= new FileOutputStream("/Users/leith/personal/SandBox/Micro-Services/microservices-project/backend/documentService/src/main/resources/webapp/"+filename);
            byteArrayOutputStream.writeTo(fout);
            byteArrayOutputStream.close();
            byteArrayOutputStream.flush();
            fout.close();
            return null;

        }catch (Exception e){
            e.printStackTrace(); // You should log or handle the exception properly
            System.out.println(e);
            return "Error occurred: " + e.getMessage();
        }
    }

}
