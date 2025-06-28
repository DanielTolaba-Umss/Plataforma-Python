package com.coders.backers.plataformapython.backend.utils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.*;

class CodeRestrictionValidatorTest {

    private CodeRestrictionValidator validator;

    @BeforeEach
    void setUp() {
        validator = new CodeRestrictionValidator();
    }

    @Test
    @DisplayName("Debe validar correctamente el código inicial")
    void validateStartingCodeTest() {

        String initialCode = "def suma_lista(numeros):\n";
        String submittedCode = "def suma_lista(numeros):\n    suma = 0\n    for num in numeros:\n        suma += num\n    return suma";

        assertTrue(validator.validateStartingCode(submittedCode, initialCode));

        String differentCode = "def otra_funcion():\n    return 0";
        assertFalse(validator.validateStartingCode(differentCode, initialCode));

        assertTrue(validator.validateStartingCode(submittedCode, ""));

        assertTrue(validator.validateStartingCode(null, null));
    }

    @Test
    @DisplayName("Debe detectar el uso de la función sum()")
    void detectSumFunctionTest() {
        String restriction = "- No usar la función sum() incorporada de Python";

        String codeWithSum = "def suma_lista(numeros):\n    return sum(numeros)";
        List<String> violations = validator.validateCode(codeWithSum, restriction);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.contains("No se permite usar la función sum()")));

        String codeWithoutSum = "def suma_lista(numeros):\n    total = 0\n    for n in numeros:\n        total += n\n    return total";
        violations = validator.validateCode(codeWithoutSum, restriction);

        assertTrue(violations.stream().noneMatch(v -> v.contains("No se permite usar la función sum()")));
    }

    @Test
    @DisplayName("Debe detectar el uso de list comprehension")
    void detectListComprehensionTest() {
        String restriction = "- No usar list comprehension";

        String codeWithListComprehension = "def suma_lista(numeros):\n    return sum([x for x in numeros])";
        List<String> violations = validator.validateCode(codeWithListComprehension, restriction);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.contains("No se permite usar list comprehension")));

        String codeWithoutListComprehension = "def suma_lista(numeros):\n    total = 0\n    for n in numeros:\n        total += n\n    return total";
        violations = validator.validateCode(codeWithoutListComprehension, restriction);

        assertTrue(violations.stream().noneMatch(v -> v.contains("No se permite usar list comprehension")));
    }

    @Test
    @DisplayName("Debe detectar el uso de recursión")
    void detectRecursionTest() {
        String restriction = "- No usar recursión";

        String codeWithRecursion = "def suma_lista(numeros):\n    if not numeros:\n        return 0\n    return numeros[0] + suma_lista(numeros[1:])";
        List<String> violations = validator.validateCode(codeWithRecursion, restriction);

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.contains("No se permite usar recursión")));

        String codeWithoutRecursion = "def suma_lista(numeros):\n    total = 0\n    for n in numeros:\n        total += n\n    return total";
        violations = validator.validateCode(codeWithoutRecursion, restriction);

        assertTrue(violations.stream().noneMatch(v -> v.contains("No se permite usar recursión")));
    }

    @Test
    @DisplayName("Debe detectar módulos potencialmente peligrosos")
    void detectDangerousModulesTest() {

        String codeWithDangerousModules = "import os\n\ndef execute_command():\n    os.system('ls -la')";
        List<String> violations = validator.validateCode(codeWithDangerousModules, "");

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.contains("peligroso")));

        String safeCode = "def suma_lista(numeros):\n    total = 0\n    for n in numeros:\n        total += n\n    return total";
        violations = validator.validateCode(safeCode, "");

        assertTrue(violations.isEmpty());
    }

    @Test
    @DisplayName("Debe detectar caracteres Unicode invisibles")
    void detectInvisibleUnicodeCharactersTest() {
        String codeWithInvisibleChars = "def suma_lista(numeros):\u200b\n    return sum(numeros)";
        List<String> violations = validator.validateCode(codeWithInvisibleChars, "");

        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.contains("caracteres Unicode invisibles")));
    }

    @ParameterizedTest
    @MethodSource("provideRestrictionsAndCodes")
    @DisplayName("Debe validar múltiples restricciones")
    void validateMultipleRestrictionsTest(String restrictions, String code, boolean shouldHaveViolations) {
        List<String> violations = validator.validateCode(code, restrictions);

        if (shouldHaveViolations) {
            assertFalse(violations.isEmpty());
        } else {
            assertTrue(violations.isEmpty());
        }
    }

    private static Stream<Arguments> provideRestrictionsAndCodes() {
        return Stream.of(
                Arguments.of(
                        "- No usar la función sum()\n- No usar list comprehension\n- No usar for",
                        "def suma_lista(numeros):\n    return sum([x for x in numeros])",
                        true),
                Arguments.of(
                        "- No usar la función sum()\n- No usar list comprehension\n- No usar recursión",
                        "def suma_lista(numeros):\n    total = 0\n    i = 0\n    while i < len(numeros):\n        total += numeros[i]\n        i += 1\n    return total",
                        false),
                Arguments.of(
                        "- No usar la función len()",
                        "def suma_lista(numeros):\n    total = 0\n    for i in range(len(numeros)):\n        total += numeros[i]\n    return total",
                        true));
    }
}
