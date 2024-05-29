package com.keyworddrivenframework.sample1.Controller;

import com.keyworddrivenframework.sample1.Entity.Module;
import com.keyworddrivenframework.sample1.Entity.Project;
import com.keyworddrivenframework.sample1.Service.ModuleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ModuleController {

    private ModuleService moduleService;

    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }
    //to get modules by project-id
    @GetMapping("/project/modules/{projectId}")
    public List<Module> getModulesByProjectId(@PathVariable Project projectId) {
        return moduleService.getModulesByProjectId(projectId);
    }
    //to add modules under a particular project
    @PostMapping("/addModule/{projectId}")
    public Module addModuleUnderProject(@PathVariable Project projectId,@RequestBody Module module){
        return moduleService.addModuleUnderProject(projectId,module);
    }
}
