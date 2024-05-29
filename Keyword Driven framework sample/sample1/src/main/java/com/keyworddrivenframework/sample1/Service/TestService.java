package com.keyworddrivenframework.sample1.Service;

import com.keyworddrivenframework.sample1.Entity.Module;
import com.keyworddrivenframework.sample1.Entity.Test;
import com.keyworddrivenframework.sample1.Repository.TestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TestService {

    private final TestRepository testRepository;

    public TestService(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    public List<Test> getAllTestsByModuleId(Module moduleId){
        return testRepository.findByModuleId(moduleId);
    }

    public Test addTestUnderModule(Module moduleId, Test test) {
        test.setModuleId(moduleId);
        return testRepository.save(test);
    }
}
