package com.keyworddrivenframework.sample1.Repository;

import com.keyworddrivenframework.sample1.Entity.Module;
import com.keyworddrivenframework.sample1.Entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {
    List<Module> findByProjectId(Project projectId);
}
