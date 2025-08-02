package tn.esprit.entities;

import java.util.Optional;

public enum PermissionName {
    READ, WRITE, DELETE,UPDATE,IMPORT;

    public static boolean isValid(String name) {
        for (PermissionName permission : PermissionName.values()) {
            if (permission.name().equalsIgnoreCase(name)) {
                return true;
            }
        }
        return false;
    }
}
