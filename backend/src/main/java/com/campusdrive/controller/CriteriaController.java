package com.campusdrive.controller;

import com.campusdrive.model.Criteria;
import com.campusdrive.repository.CriteriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/criteria")
public class CriteriaController {

    @Autowired
    private CriteriaRepository criteriaRepository;

    @PostMapping("/set")
    public ResponseEntity<String> setCriteria(@RequestBody Criteria criteria) {
        criteriaRepository.save(criteria);
        return ResponseEntity.ok("Criteria saved successfully");
    }

    @GetMapping("/get")
    public Criteria getCriteria() {
        return criteriaRepository.findAll().stream().findFirst().orElse(null);
    }
}
