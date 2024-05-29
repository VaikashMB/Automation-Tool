package com.keyworddrivenframework.sample1.Service;

import com.keyworddrivenframework.sample1.Entity.Module;
import com.keyworddrivenframework.sample1.Entity.Project;
import com.keyworddrivenframework.sample1.Repository.ModuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    public List<Module> getModulesByProjectId(Project projectId) {
        return moduleRepository.findByProjectId(projectId);
    }

    public Module addModuleUnderProject(Project projectId, Module module) {
        module.setProjectId(projectId);
        return moduleRepository.save(module);
    }
}
