package com.keyworddrivenframework.sample1.Repository;

import com.keyworddrivenframework.sample1.Entity.Module;
import com.keyworddrivenframework.sample1.Entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestRepository extends JpaRepository<Test, Integer> {
    List<Test> findByModuleId(Module moduleId);
}
