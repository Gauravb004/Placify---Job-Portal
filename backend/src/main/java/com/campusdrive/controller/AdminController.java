package com.campusdrive.controller;

import com.campusdrive.model.Admin;
import com.campusdrive.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Admin admin) {
        adminRepository.save(admin);
        return ResponseEntity.ok("Admin signup successful");
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Admin admin) {
        Admin existing = adminRepository.findByEmailAndPassword(admin.getEmail(), admin.getPassword());
        if (existing != null) {
            return ResponseEntity.ok("Admin login successful");
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }
}
