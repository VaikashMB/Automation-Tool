package com.keyworddrivenframework.sample1.Repository;

import com.keyworddrivenframework.sample1.Entity.Test;
import com.keyworddrivenframework.sample1.Entity.TestResults;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestResultsRepository extends JpaRepository<TestResults,Integer> {
    List<TestResults> findTestResultsByRunId(String runId);
    List<TestResults> findByTestId(Test testId);
}
