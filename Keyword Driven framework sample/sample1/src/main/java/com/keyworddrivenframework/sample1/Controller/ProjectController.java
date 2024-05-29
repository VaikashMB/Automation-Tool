package com.keyworddrivenframework.sample1.Controller;

import com.keyworddrivenframework.sample1.Entity.Project;
import com.keyworddrivenframework.sample1.Service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    //to get all projects from the db
    @GetMapping("/allProjects")
    public List<Project> getAllProjects(){
        return projectService.getAllProjects();
    }
    //to add projects into the db
    @PostMapping("/addProject")
    public Project addProject(@RequestBody Project project){
        return projectService.addProject(project);
    }
}
