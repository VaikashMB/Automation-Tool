package com.keyworddrivenframework.sample1.Repository;

import com.keyworddrivenframework.sample1.Entity.ActionKeywords;
import com.keyworddrivenframework.sample1.Entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KeywordRepository extends JpaRepository<ActionKeywords,Integer> {
    List<ActionKeywords> findByTestId(Test testId);
}
