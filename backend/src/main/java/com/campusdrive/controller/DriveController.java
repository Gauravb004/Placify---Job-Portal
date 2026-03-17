package com.campusdrive.controller;

import com.campusdrive.model.Drive;
import com.campusdrive.repository.DriveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/drive")
@CrossOrigin(origins = "http://localhost:3000") // ✅ allow React frontend
public class DriveController {

    @Autowired
    private DriveRepository driveRepository;

    // ✅ Add new drive
    @PostMapping("/add")
    public ResponseEntity<String> addDrive(@RequestBody Drive drive) {
        // Required fields check
        if (drive.getCompanyName() == null || drive.getCompanyName().trim().isEmpty()
                || drive.getRole() == null || drive.getRole().trim().isEmpty()
                || drive.getDate() == null || drive.getDate().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Company, Role and Date are required");
        }

        // Optional fields cleanup
        if (drive.getMinCgpa() == null) drive.setMinCgpa(null);
        if (drive.getBranch() != null && drive.getBranch().trim().isEmpty()) drive.setBranch(null);
        if (drive.getSkills() != null && drive.getSkills().trim().isEmpty()) drive.setSkills(null);

        driveRepository.save(drive);
        return ResponseEntity.ok("Drive added successfully");
    }

    // ✅ Get all drives
    @GetMapping("/all")
    public List<Drive> getAllDrives() {
        return driveRepository.findAll();
    }

    // ✅ Update drive
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateDrive(@PathVariable Long id, @RequestBody Drive updatedDrive) {
        Optional<Drive> existing = driveRepository.findById(id);
        if (existing.isPresent()) {
            Drive drive = existing.get();

            // Update only non-empty fields
            if (updatedDrive.getCompanyName() != null && !updatedDrive.getCompanyName().trim().isEmpty()) {
                drive.setCompanyName(updatedDrive.getCompanyName());
            }
            if (updatedDrive.getRole() != null && !updatedDrive.getRole().trim().isEmpty()) {
                drive.setRole(updatedDrive.getRole());
            }
            drive.setMinCgpa(updatedDrive.getMinCgpa());
            drive.setBranch(updatedDrive.getBranch());
            drive.setSkills(updatedDrive.getSkills());
            drive.setDate(updatedDrive.getDate());

            driveRepository.save(drive);
            return ResponseEntity.ok("Drive updated successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Delete drive
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDrive(@PathVariable Long id) {
        if (driveRepository.existsById(id)) {
            driveRepository.deleteById(id);
            return ResponseEntity.ok("Drive deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
