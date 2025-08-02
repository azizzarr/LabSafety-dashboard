package tn.esprit.Interfaces;

import tn.esprit.entities.Role;

import java.util.List;

public interface IRoleService {


    List<Role> findAll();

    Role addRole(Role role);

    Role updateRole(Role role, Long roleID);

    void deleteRoleById(Long roleID);
}
