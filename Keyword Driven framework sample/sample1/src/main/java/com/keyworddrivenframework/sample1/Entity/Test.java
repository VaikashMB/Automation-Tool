package com.keyworddrivenframework.sample1.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "test")
@Entity
public class Test  {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int testId;

    private String testName;

    private String testDescription;

    @ManyToOne
    @JoinColumn(name = "moduleId",referencedColumnName = "moduleId")
    private Module moduleId;




}
