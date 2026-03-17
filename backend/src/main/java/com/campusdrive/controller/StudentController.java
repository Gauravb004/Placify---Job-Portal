package com.campusdrive.controller;

import com.campusdrive.model.Student;
import com.campusdrive.model.Drive;
import com.campusdrive.repository.StudentRepository;
import com.campusdrive.repository.DriveRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Arrays;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/student")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private DriveRepository driveRepository;

    // ✅ Signup
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody Student student) {
        Optional<Student> existing = studentRepository.findByEmail(student.getEmail().toLowerCase());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
        }
        student.setEmail(student.getEmail().toLowerCase()); // normalize email
        studentRepository.save(student);
        return ResponseEntity.ok("Signup successful");
    }

    // ✅ Login
    @PostMapping("/login")
    public ResponseEntity<Student> login(@RequestBody Student loginData) {
        Optional<Student> studentOpt = studentRepository.findByEmail(loginData.getEmail().toLowerCase());
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            if (student.getPassword().equals(loginData.getPassword())) {
                return ResponseEntity.ok(student);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    // ✅ Save/Update student profile
    @PostMapping("/addOrUpdate")
    public ResponseEntity<Student> addOrUpdateStudent(@RequestBody Student student) {
        if (student.getEmail() == null || student.getPassword() == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<Student> existing = studentRepository.findByEmail(student.getEmail().toLowerCase());
        if (existing.isPresent()) {
            Student existingStudent = existing.get();
            existingStudent.setName(student.getName());
            existingStudent.setBranch(student.getBranch());
            existingStudent.setCgpa(student.getCgpa());
            existingStudent.setPassword(student.getPassword());
            existingStudent.setSkills(student.getSkills());
            studentRepository.save(existingStudent);
            return ResponseEntity.ok(existingStudent);
        } else {
            student.setEmail(student.getEmail().toLowerCase());
            Student saved = studentRepository.save(student);
            return ResponseEntity.ok(saved);
        }
    }

    // ✅ Upload Resume
    @PostMapping("/uploadResume/{id}")
    public ResponseEntity<Student> uploadResume(@PathVariable Long id, @RequestParam("resume") MultipartFile file) {
        Optional<Student> studentOpt = studentRepository.findById(id);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            try {
                String uploadDir = "uploads/resumes/";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                String filePath = uploadDir + file.getOriginalFilename();
                file.transferTo(new File(filePath));

                student.setResumePath(filePath);
                studentRepository.save(student);

                return ResponseEntity.ok(student);
            } catch (IOException e) {
                return ResponseEntity.status(500).build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Eligible Drives
    @GetMapping("/eligible/{id}")
    public ResponseEntity<List<Drive>> getEligibleDrives(@PathVariable Long id) {
        Optional<Student> studentOpt = studentRepository.findById(id);
        if (studentOpt.isPresent()) {
            Student student = studentOpt.get();
            List<Drive> drives = driveRepository.findAll();

            List<Drive> eligible = drives.stream()
                    .filter(d ->
                            (d.getMinCgpa() == null || student.getCgpa() >= d.getMinCgpa()) &&
                                    (d.getBranch() == null || d.getBranch().equalsIgnoreCase("ALL")
                                            || d.getBranch().equalsIgnoreCase(student.getBranch())) &&
                                    (d.getSkills() == null || d.getSkills().equalsIgnoreCase("ALL")
                                            || Arrays.stream(d.getSkills().toLowerCase().split(","))
                                            .anyMatch(skill -> student.getSkills() != null &&
                                                    student.getSkills().toLowerCase().contains(skill.trim())))
                    )
                    .collect(Collectors.toList());

            return ResponseEntity.ok(eligible);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
