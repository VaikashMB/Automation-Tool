package com.keyworddrivenframework.sample1.Service;

import com.keyworddrivenframework.sample1.Entity.Test;
import com.keyworddrivenframework.sample1.Entity.TestResults;
import com.keyworddrivenframework.sample1.Repository.TestResultsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestResultsService {

    private final TestResultsRepository testResultsRepository;

    public TestResultsService(TestResultsRepository testResultsRepository) {
        this.testResultsRepository = testResultsRepository;
    }
    //to post testResults
    public List<TestResults> postTestResults(List<TestResults> testResults) {
        for (TestResults testResult : testResults) {
            testResultsRepository.save(testResult);
        }
        return testResults;
    }
//to fetch testResults by runId
    public List<TestResults> getTestResultsByRunId(String runId) {
        return testResultsRepository.findTestResultsByRunId(runId);
    }
//to fetch testResults by testId
    public List<TestResults> getTestResultsByTestId(Test testId) {
        return testResultsRepository.findByTestId(testId);
    }
}
