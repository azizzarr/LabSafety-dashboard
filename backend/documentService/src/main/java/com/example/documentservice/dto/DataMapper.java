package com.example.documentservice.dto;

import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class DataMapper {
    public Context setData(Student student){
        Context context=new Context();
        Map<String, Object> data= new HashMap<>();
        data.put("student",student);
        context.setVariables(data);
        return context;
    }
}
