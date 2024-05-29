package com.keyworddrivenframework.sample1.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "test_results")
public class TestResults {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String description;
    private String result;
    private String screenshotLink;

    @ManyToOne
    @JoinColumn(name = "testId",referencedColumnName = "testId")
    private Test testId;

    private String runId;

}
