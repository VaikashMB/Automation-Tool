package com.keyworddrivenframework.sample1.Repository;

import com.keyworddrivenframework.sample1.Entity.Locator;
import com.keyworddrivenframework.sample1.Entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocatorRepository extends JpaRepository<Locator, Integer> {
    List<Locator> findByTestId(Test testId);
    List<Locator> findByLocatorNameContainingIgnoreCase(String query);
    List<Locator> findByTestIdAndLocatorNameContainingIgnoreCase(Test testId, String query);
}
