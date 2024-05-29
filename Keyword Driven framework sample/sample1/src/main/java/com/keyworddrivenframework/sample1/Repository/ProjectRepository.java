package com.keyworddrivenframework.sample1.Repository;

import com.keyworddrivenframework.sample1.Entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project,String> {
}
