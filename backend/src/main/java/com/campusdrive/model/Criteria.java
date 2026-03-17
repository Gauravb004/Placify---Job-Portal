package com.campusdrive.model;

import jakarta.persistence.*;

@Entity
@Table(name = "criteria")
public class Criteria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double minCgpa;
    private String branch;
    private String skill;

    // Getters & Setters
}
