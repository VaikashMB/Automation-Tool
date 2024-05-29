package com.keyworddrivenframework.sample1.Controller;

import com.keyworddrivenframework.sample1.Entity.Module;
import com.keyworddrivenframework.sample1.Entity.Test;
import com.keyworddrivenframework.sample1.Service.TestService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class TestController {

    private TestService testService;

    public TestController(TestService testService) {
        this.testService = testService;
    }
    //to get all tests under a particular module
    @GetMapping("/tests/{moduleId}")
    public List<Test> getAllTestsByModuleId(@PathVariable Module moduleId){
        return testService.getAllTestsByModuleId(moduleId);
    }
    //to add a test under a particular module
    @PostMapping("/addTest/{moduleId}")
    public Test addTestUnderModule(@PathVariable Module moduleId,@RequestBody Test test){
        return testService.addTestUnderModule(moduleId,test);
    }
}
