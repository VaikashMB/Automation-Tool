package com.keyworddrivenframework.sample1.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "test-steps")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActionKeywords {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private float orderOfExecution;
    private String keyword;
    private String description;
    private String locatorType;
    private String locatorValue;
    private String value;
    private String locatorType2;
    private String locatorValue2;
    private String flag;
    private boolean screenshot;

    @ManyToOne
    @JoinColumn(name = "testId",referencedColumnName = "testId")
    private Test testId;
}
