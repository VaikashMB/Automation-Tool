package com.keyworddrivenframework.sample1.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "locator")
@Entity
public class Locator {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int locatorId;
    private String locatorName;
    private String locatorType1;
    private String locatorValue1;
    private String locatorType2;
    private String locatorValue2;

    @ManyToOne
    @JoinColumn(name = "testId",referencedColumnName = "testId")
    private Test testId;
}
