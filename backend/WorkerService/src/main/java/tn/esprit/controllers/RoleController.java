package tn.esprit.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.entities.Role;
import tn.esprit.Interfaces.IRoleService;


@RestController

@RequestMapping("/role")
public class RoleController {

    @Autowired
    IRoleService roleService;


    @PostMapping("/post")
    @ResponseBody
    public Role add(@RequestBody Role role) {
        return roleService.addRole(role);
    }




    @PostMapping("updateRole/{roleID}")
    @ResponseBody
    Role updateRole(@RequestBody Role role,@PathVariable Long roleID){
        return roleService.updateRole(role, roleID);
    }


    @GetMapping("/getRole")
    @ResponseBody
    public List<Role> findAll() {
        return roleService.findAll();
    }


    @DeleteMapping("/delete/{roleID}")
    public void deleteContributorById(@PathVariable Long roleID) {
        roleService.deleteRoleById(roleID);

    }

    @GetMapping("/hi")
    public String sayHi() {
        return "Hi";
    }
}
