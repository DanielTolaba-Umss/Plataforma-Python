package com.coders.backers.plataformapython.backend.utils;

import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;

import com.coders.backers.plataformapython.backend.dto.tryPractice.python.CodeExecutionResult;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
@Slf4j
@Component
public class PythonExecution {
    private final ObjectMapper objectMapper;
    private static final String DOCKER_IMAGE = "python-sandbox";

    @Value("${python.execution.timeout:5}")
    private int executionTimeout;

    public PythonExecution(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public CodeExecutionResult executeCode(String code, String input, String expectedOutput) {
        Process process = null;

        try {

            process = startContainer();

            String result = sendCodeAndGetResult(process, code, input, expectedOutput);

            return objectMapper.readValue(result, CodeExecutionResult.class);
        } catch (Exception e) {
            log.error("Error al ejecutar código Python: {}", e.getMessage());
            return CodeExecutionResult.builder()
                    .success(false)
                    .output("")
                    .error("Error al ejecutar el código: " + e.getMessage())
                    .build();
        } finally {
            if (process != null) {
                process.destroyForcibly();
            }
        }
    }

    private Process startContainer() throws IOException {
        ProcessBuilder pb = new ProcessBuilder(
                "docker", "run", "--rm", "-i",
                DOCKER_IMAGE);
        return pb.start();
    }

    private String sendCodeAndGetResult(Process process, String code, String input, String expectedOutput)
            throws IOException, InterruptedException {

        Map<String, String> jsonInput = new HashMap<>();
        jsonInput.put("code", code);
        jsonInput.put("input", input != null ? input : "");
        jsonInput.put("expected", expectedOutput != null ? expectedOutput : "");

        String jsonString = objectMapper.writeValueAsString(jsonInput);

        try (OutputStreamWriter writer = new OutputStreamWriter(process.getOutputStream(), StandardCharsets.UTF_8)) {
            writer.write(jsonString);
            writer.flush();
        }

        boolean completed = process.waitFor(executionTimeout, TimeUnit.SECONDS);
        if (!completed) {
            log.warn("La ejecución excedió el tiempo límite");
            process.destroyForcibly();
            return createTimeoutErrorJson();
        }

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8))) {
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line);
            }
            return output.toString();
        }
    }

    private String createTimeoutErrorJson() {
        return String.format(
                "{\"success\":false,\"output\":\"\",\"error\":\"La ejecución excedió el tiempo límite de %d segundos\"}",
                executionTimeout);
    }
}
