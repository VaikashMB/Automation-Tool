package com.keyworddrivenframework.sample1.Controller;

import com.keyworddrivenframework.sample1.Entity.Test;
import com.keyworddrivenframework.sample1.Entity.TestResults;
import com.keyworddrivenframework.sample1.Service.TestResultsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class TestResultsController {

    private TestResultsService testResultsService;

    public TestResultsController(TestResultsService testResultsService) {
        this.testResultsService = testResultsService;
    }
    //to post the test-results into the db
    @PostMapping("/postTestResults")
    public List<TestResults> postTestResults(@RequestBody List<TestResults> testResults){
        return testResultsService.postTestResults(testResults);
    }
    //to obtain the test-results under a particular run-id
    @GetMapping("/getTestResultsByRunId/{runId}")
    public List<TestResults> getTestResultsByRunId(@PathVariable String runId){
        return testResultsService.getTestResultsByRunId(runId);
    }
    //to obtain the test-results under a particular test-id
    @GetMapping("/getTestResultsByTestId/{testId}")
    public List<TestResults> getTestResultsByTestId(@PathVariable Test testId){
        return testResultsService.getTestResultsByTestId(testId);
    }
}
