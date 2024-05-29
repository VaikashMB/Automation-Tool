package com.keyworddrivenframework.sample1.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ExecutionRequest {
    private List<Map<String, String>> actionKeyword;
    private List<String> browsers;
}
