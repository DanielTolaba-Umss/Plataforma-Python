package com.coders.backers.plataformapython.backend.services.impl;

import com.coders.backers.plataformapython.backend.dto.python.CodeExecutionRequest;
import com.coders.backers.plataformapython.backend.dto.python.CodeExecutionResult;
import com.coders.backers.plataformapython.backend.services.PythonExecutionService;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;

@Service
@Slf4j
public class PythonExecutionServiceImpl implements PythonExecutionService {
    private final ObjectMapper objectMapper;

    public PythonExecutionServiceImpl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        // Configuramos el ObjectMapper para ser más tolerante con las respuestas JSON
        this.objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Value("${python.execution.timeout:10}")
    private int executionTimeout;


     @Override
     public CodeExecutionResult executeCode(CodeExecutionRequest request) {
        try {
      // Crear el proceso Docker con límites de recursos
      ProcessBuilder pb = new ProcessBuilder(
      "docker", "run",
      "--rm",
      "-i",
      "python-sandbox");
      
      Process process = pb.start();
      // Crear un Future para manejar el timeout
      ExecutorService executor = Executors.newSingleThreadExecutor();
      Future<CodeExecutionResult> future = executor.submit(() -> {
      try {
      try {
      OutputStreamWriter writer = new
      OutputStreamWriter(process.getOutputStream());
      if (request.getCode() == null || request.getCode().trim().isEmpty()) {
      log.error("El código recibido está vacío");
      }
      
      // Construir un mapa y serializarlo para garantizar un JSON válido
      java.util.Map<String, String> jsonMap = new java.util.HashMap<>();
      jsonMap.put("code", request.getCode());
      String jsonCode = objectMapper.writeValueAsString(jsonMap);
      log.info("Enviando al contenedor: {}", jsonCode);
      
      writer.write(jsonCode);
      writer.flush();
      writer.close();
      } catch (Exception e) {
      log.error("Error escribiendo código al contenedor Python", e);
      }
      
      boolean completed = process.waitFor(5, TimeUnit.SECONDS);
      if (!completed) {
      log.warn("El proceso Python no finalizó dentro del tiempo esperado");
      process.destroyForcibly();
      }
      StringBuilder outputBuilder = new StringBuilder();
      try {
      BufferedReader reader = new BufferedReader(
      new InputStreamReader(process.getInputStream()));
      
      String line;
      log.info("Comenzando a leer salida del proceso...");
      
      while ((line = reader.readLine()) != null) {
      outputBuilder.append(line).append("\n");
      log.debug("Línea leída: {}", line);
      }
      
      log.info("Finalizada lectura de salida del proceso");
      } catch (Exception e) {
      log.error("Error leyendo la salida del contenedor", e);
      }
      
      StringBuilder errorBuilder = new StringBuilder();
      try (BufferedReader errorReader = new BufferedReader(
      new InputStreamReader(process.getErrorStream()))) {
      String line;
      while ((line = errorReader.readLine()) != null) {
      errorBuilder.append(line).append("\n");
      }
      }
      
      if (errorBuilder.length() > 0) {
      log.warn("Error del contenedor Python: {}", errorBuilder.toString());
      }
      String output = outputBuilder.toString().trim();
      log.info("Respuesta del contenedor Python: {}", output);
      if (output.isEmpty()) {
      log.warn("La respuesta del contenedor Python está vacía");
      
      // Probemos a ejecutar Docker directamente para depuración
      try {
      ProcessBuilder debugPb = new ProcessBuilder(
      "docker", "run", "--rm", "python-sandbox",
      "python", "-c",
      "import json; print(json.dumps({'success': True, 'output': 'Test directo', 'error': ''}))"
      );
      Process debugProcess = debugPb.start();
      BufferedReader debugReader = new BufferedReader(
      new InputStreamReader(debugProcess.getInputStream()));
      String debugLine = debugReader.readLine();
      log.info("Prueba de depuración Docker: {}", debugLine);
      } catch (Exception debugEx) {
      log.error("Error en prueba de depuración: ", debugEx);
      }
      
      String directOutput =
      "El código se ejecutó correctamente pero no produjo salida";
      
      if (request.getCode().contains("print")) {
      try {
      ProcessBuilder directRunPb = new ProcessBuilder(
      "docker", "run", "--rm", "-i", "-e", "PYTHONUNBUFFERED=1",
      "python-sandbox");
      Process directRunProcess = directRunPb.start();
      try (OutputStreamWriter writer = new OutputStreamWriter(
      directRunProcess.getOutputStream())) {
      
      // Construir un mapa y serializarlo para garantizar un JSON válido
      java.util.Map<String, String> jsonMap = new java.util.HashMap<>();
      jsonMap.put("code", request.getCode());
      String jsonCode = objectMapper.writeValueAsString(jsonMap);
      log.info("Enviando al contenedor (ejecución directa): {}", jsonCode);
      
      writer.write(jsonCode);
      writer.flush();
      writer.close();
      }
      
      BufferedReader directReader = new BufferedReader(
      new InputStreamReader(directRunProcess.getInputStream()));
      StringBuilder directBuilder = new StringBuilder();
      String directLine;
      while ((directLine = directReader.readLine()) != null) {
      directBuilder.append(directLine).append("\n");
      }
      
      if (directBuilder.length() > 0) {
      directOutput = directBuilder.toString().trim();
      log.info("Salida directa de Python: {}", directOutput);
      }
      } catch (Exception directEx) {
      log.error("Error en ejecución directa: ", directEx);
      }
      }
      
      return CodeExecutionResult.builder()
      .success(true)
      .output(directOutput)
      .error("")
      .build();
      }
      
      try {
      log.info("Intentando parsear el JSON: {}", output);
      return objectMapper.readValue(output, CodeExecutionResult.class);
      } catch (Exception e) {
      log.error("Error al parsear el JSON de respuesta: {} - Contenido: [{}]",
      e.getMessage(),
      output);
      log.error("Stack trace: ", e);
      
      if (output.contains("El resultado es:")) {
      return CodeExecutionResult.builder()
      .success(true)
      .output(output)
      .error("")
      .build();
      } else {
      return CodeExecutionResult.builder()
      .success(true)
      .output(output)
      .error("")
      .build();
      }
      }
      } catch (Exception e) {
      log.error("Error leyendo la respuesta del contenedor Python: ", e);
      throw e;
      }
      });
      
      try {
      CodeExecutionResult result = future.get(executionTimeout, TimeUnit.SECONDS);
      process.waitFor();
      return result;
      } catch (TimeoutException e) {
      process.destroyForcibly();
      return CodeExecutionResult.builder()
      .success(false)
      .error("La ejecución excedió el tiempo límite de " + executionTimeout +
      " segundos")
      .build();
      } finally {
      executor.shutdownNow();
      }
      } catch (Exception e) {
      log.error("Error ejecutando código Python", e);
      return CodeExecutionResult.builder()
      .success(false)
      .error("Error interno del servidor: " + e.getMessage())
      .build();
      }
    }
     
/*
    @Override
    public CodeExecutionResult executeCode(CodeExecutionRequest request) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Process process = null;

        try {
            process = startDockerContainer();

            // Capturamos el proceso en una variable separada para la lambda
            Process containerProcess = process;
            Future<CodeExecutionResult> future = executor
                    .submit(() -> executeCodeInContainer(containerProcess, request));

            return getResultWithTimeout(future, process);
        } catch (Exception e) {
            log.error("Error ejecutando código Python", e);
            return buildErrorResult("Error interno del servidor: " + e.getMessage());
        } finally {
            if (process != null) {
                process.destroyForcibly();
            }
            executor.shutdownNow();
        }
    }

    private Process startDockerContainer() throws IOException {
        ProcessBuilder pb = new ProcessBuilder(
                "docker", "run",
                "--rm",
                "-i",
                "python-sandbox");
        return pb.start();
    }

    private CodeExecutionResult executeCodeInContainer(Process process, CodeExecutionRequest request) {
        try {
            sendCodeToContainer(process, request);

            boolean completed = process.waitFor(5, TimeUnit.SECONDS);
            if (!completed) {
                log.warn("El proceso Python no finalizó dentro del tiempo esperado");
                process.destroyForcibly();
            }

            String output = readProcessOutput(process);
            String errorOutput = readProcessError(process);

            if (!errorOutput.isEmpty()) {
                log.warn("Error del contenedor Python: {}", errorOutput);
            }

            return processContainerResponse(output, request);
        } catch (Exception e) {
            log.error("Error leyendo la respuesta del contenedor Python: ", e);
            throw new RuntimeException("Error procesando respuesta", e);
        }
    }

    private void sendCodeToContainer(Process process, CodeExecutionRequest request) {
        try (OutputStreamWriter writer = new OutputStreamWriter(process.getOutputStream())) {
            if (request.getCode() == null || request.getCode().trim().isEmpty()) {
                log.error("El código recibido está vacío");
            }

            Map<String, String> jsonMap = new HashMap<>();
            jsonMap.put("code", request.getCode());
            String jsonCode = objectMapper.writeValueAsString(jsonMap);
            log.info("Enviando al contenedor: {}", jsonCode);

            writer.write(jsonCode);
            writer.flush();
        } catch (Exception e) {
            log.error("Error escribiendo código al contenedor Python", e);
        }
    }

    private String readProcessOutput(Process process) {
        StringBuilder outputBuilder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {
            String line;
            log.info("Comenzando a leer salida del proceso...");

            while ((line = reader.readLine()) != null) {
                outputBuilder.append(line).append("\n");
                log.debug("Línea leída: {}", line);
            }

            log.info("Finalizada lectura de salida del proceso");
        } catch (Exception e) {
            log.error("Error leyendo la salida del contenedor", e);
        }

        return outputBuilder.toString().trim();
    }

    private String readProcessError(Process process) {
        StringBuilder errorBuilder = new StringBuilder();
        try (BufferedReader errorReader = new BufferedReader(
                new InputStreamReader(process.getErrorStream()))) {
            String line;
            while ((line = errorReader.readLine()) != null) {
                errorBuilder.append(line).append("\n");
            }
        } catch (Exception e) {
            log.error("Error leyendo el stream de error", e);
        }

        return errorBuilder.toString().trim();
    }

    private CodeExecutionResult processContainerResponse(String output, CodeExecutionRequest request) {
        if (output.isEmpty()) {
            log.warn("La respuesta del contenedor Python está vacía");
            runDebugContainer();
            String directOutput = executeDirectRunIfNeeded(request);

            return CodeExecutionResult.builder()
                    .success(true)
                    .output(directOutput)
                    .error("")
                    .build();
        }

        try {
            log.info("Intentando parsear el JSON: {}", output);
            return objectMapper.readValue(output, CodeExecutionResult.class);
        } catch (Exception e) {
            log.error("Error al parsear el JSON de respuesta: {} - Contenido: [{}]", e.getMessage(), output);
            log.error("Stack trace: ", e);

            return CodeExecutionResult.builder()
                    .success(true)
                    .output(output)
                    .error("")
                    .build();
        }
    }

    private void runDebugContainer() {
        try {
            ProcessBuilder debugPb = new ProcessBuilder(
                    "docker", "run", "--rm", "python-sandbox",
                    "python", "-c",
                    "import json; print(json.dumps({'success': True, 'output': 'Test directo', 'error': ''}))");
            Process debugProcess = debugPb.start();
            BufferedReader debugReader = new BufferedReader(
                    new InputStreamReader(debugProcess.getInputStream()));
            String debugLine = debugReader.readLine();
            log.info("Prueba de depuración Docker: {}", debugLine);
        } catch (Exception debugEx) {
            log.error("Error en prueba de depuración: ", debugEx);
        }
    }

    private String executeDirectRunIfNeeded(CodeExecutionRequest request) {
        String directOutput = "El código se ejecutó correctamente pero no produjo salida";

        if (!request.getCode().contains("print")) {
            return directOutput;
        }

        try {
            ProcessBuilder directRunPb = new ProcessBuilder(
                    "docker", "run", "--rm", "-i", "-e", "PYTHONUNBUFFERED=1",
                    "python-sandbox");
            Process directRunProcess = directRunPb.start();

            try (OutputStreamWriter writer = new OutputStreamWriter(directRunProcess.getOutputStream())) {
                Map<String, String> jsonMap = new HashMap<>();
                jsonMap.put("code", request.getCode());
                String jsonCode = objectMapper.writeValueAsString(jsonMap);
                log.info("Enviando al contenedor (ejecución directa): {}", jsonCode);

                writer.write(jsonCode);
                writer.flush();
            }

            BufferedReader directReader = new BufferedReader(
                    new InputStreamReader(directRunProcess.getInputStream()));
            StringBuilder directBuilder = new StringBuilder();
            String directLine;
            while ((directLine = directReader.readLine()) != null) {
                directBuilder.append(directLine).append("\n");
            }

            if (directBuilder.length() > 0) {
                directOutput = directBuilder.toString().trim();
                log.info("Salida directa de Python: {}", directOutput);
            }
        } catch (Exception directEx) {
            log.error("Error en ejecución directa: ", directEx);
        }

        return directOutput;
    }

    private CodeExecutionResult getResultWithTimeout(Future<CodeExecutionResult> future, Process process) {
        try {
            CodeExecutionResult result = future.get(executionTimeout, TimeUnit.SECONDS);
            process.waitFor();
            return result;
        } catch (TimeoutException e) {
            process.destroyForcibly();
            return buildErrorResult("La ejecución excedió el tiempo límite de " + executionTimeout + " segundos");
        } catch (Exception e) {
            log.error("Error al obtener el resultado de la ejecución", e);
            return buildErrorResult("Error al procesar el resultado: " + e.getMessage());
        }
    }

    private CodeExecutionResult buildErrorResult(String errorMessage) {
        return CodeExecutionResult.builder()
                .success(false)
                .error(errorMessage)
                .build();
    }
*/
}
