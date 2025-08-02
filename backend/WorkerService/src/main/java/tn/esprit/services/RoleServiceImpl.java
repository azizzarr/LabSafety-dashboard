package tn.esprit.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.entities.Role;
import tn.esprit.Interfaces.IRoleService;
import tn.esprit.repositories.RoleRepository;

import java.util.List;

@Service
@Slf4j
public class RoleServiceImpl implements IRoleService {


    @Autowired
    RoleRepository roleRepository;



    //afficher la liste des users
    @Override
    public List<Role> findAll() {
        return  roleRepository.findAll();
    }


    //ajouter un user
    @Override
    public Role addRole(Role role) {

        return roleRepository.save(role);
    }

    @Override
    public Role updateRole(Role role, Long roleID) {

        role.setRoleId(roleID);
        return roleRepository.save(role);

    }

    //effacer un user
    @Override
    public void deleteRoleById(Long roleID) {
        roleRepository.deleteById(roleID);

    }


}
