package com.campusdrive.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.campusdrive.model.Drive;
import java.util.List;

public interface DriveRepository extends JpaRepository<Drive, Long> {

    // ✅ Find drives by branch (case-insensitive)
    List<Drive> findByBranchIgnoreCase(String branch);

    // ✅ Find drives where branch is ALL (eligible for everyone)
    List<Drive> findByBranchIgnoreCaseOrBranchIgnoreCase(String branch, String all);

    // ✅ Find drives by minimum CGPA requirement
    List<Drive> findByMinCgpaLessThanEqual(Double cgpa);

    // ✅ Find drives by skills (simple contains check)
    List<Drive> findBySkillsContainingIgnoreCase(String skill);
}
