package tn.esprit.dataTransfer.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AssignedResponse {
    private Long id;
    private String Bloc;
    List<String> users;


}
