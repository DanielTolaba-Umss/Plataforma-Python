package com.coders.backers.plataformapython.backend.utils;

import org.springframework.stereotype.Component;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.function.Predicate;

@Component
public class CodeRestrictionValidator {

    private final Map<Pattern, Pair<Predicate<String>, String>> restrictionValidators;

    private final Set<String> dangerousModules = new HashSet<>(Arrays.asList(
            "os", "subprocess", "sys", "socket", "requests", "urllib", "http.client",
            "ftplib", "telnetlib", "smtplib", "popen", "exec", "eval", "compile",
            "pty", "commands", "base64", "pickle", "cPickle", "marshal", "shelve"));

    public CodeRestrictionValidator() {
        restrictionValidators = new HashMap<>();

        restrictionValidators.put(
                Pattern.compile("(?i)no usar (?:la función )?sum\\(\\)"),
                new Pair<>(this::containsSum, "No se permite usar la función sum()"));

        restrictionValidators.put(
                Pattern.compile("(?i)no usar list comprehension"),
                new Pair<>(this::containsListComprehension, "No se permite usar list comprehension"));

        restrictionValidators.put(
                Pattern.compile("(?i)no usar recursión|no usar recursion"),
                new Pair<>(this::containsRecursion, "No se permite usar recursión"));

        restrictionValidators.put(
                Pattern.compile("(?i)no usar while"),
                new Pair<>(code -> Pattern.compile("\\bwhile\\b").matcher(code).find(),
                        "No se permite usar bucles while"));

        restrictionValidators.put(
                Pattern.compile("(?i)no usar for"),
                new Pair<>(code -> Pattern.compile("\\bfor\\b").matcher(code).find(),
                        "No se permite usar bucles for"));

        restrictionValidators.put(
                Pattern.compile("(?i)no usar import|no importar"),
                new Pair<>(code -> Pattern.compile("\\bimport\\b").matcher(code).find(),
                        "No se permite importar módulos"));

        restrictionValidators.put(
                Pattern.compile("(?i)no usar lambda"),
                new Pair<>(code -> Pattern.compile("\\blambda\\b").matcher(code).find(),
                        "No se permite usar expresiones lambda"));

        restrictionValidators.put(
                Pattern.compile("(?i)no usar (?:expresi[oó]n(?:es)? )?ternaria(?:s)?"),
                new Pair<>(code -> Pattern.compile("\\?|if\\s+.+\\s+else").matcher(code).find(),
                        "No se permite usar expresiones ternarias"));
    }

    public List<String> validateCode(String code, String restrictions) {
        List<String> violations = new ArrayList<>();

        if (code == null || restrictions == null || restrictions.trim().isEmpty()) {
            return violations;
        }

        String[] restrictionLines = restrictions.split("\n");

        for (String line : restrictionLines) {
            line = line.trim();
            if (line.startsWith("-") || line.startsWith("*")) {
                line = line.substring(1).trim();

                for (Map.Entry<Pattern, Pair<Predicate<String>, String>> entry : restrictionValidators.entrySet()) {
                    if (entry.getKey().matcher(line).find()) {
                        if (entry.getValue().getFirst().test(code)) {
                            violations.add(entry.getValue().getSecond());
                        }
                    }
                }

                if (line.matches("(?i).*no usar (?:la función )?\\w+\\(\\).*")) {
                    Pattern functionPattern = Pattern.compile("no usar (?:la función )?(\\w+)\\(\\)",
                            Pattern.CASE_INSENSITIVE);
                    Matcher matcher = functionPattern.matcher(line);
                    if (matcher.find()) {
                        String functionName = matcher.group(1);
                        if (containsFunction(code, functionName)) {
                            violations.add("No se permite usar la función " + functionName + "()");
                        }
                    }
                }
            }
        }

        List<String> dangerousImports = checkDangerousImports(code);
        violations.addAll(dangerousImports);

        return violations;
    }

    public boolean validateStartingCode(String submittedCode, String initialCode) {
        if (submittedCode == null || initialCode == null || initialCode.trim().isEmpty()) {
            return true;
        }

        String cleanedSubmitted = cleanCodeForComparison(submittedCode);
        String cleanedInitial = cleanCodeForComparison(initialCode);

        return cleanedSubmitted.startsWith(cleanedInitial);
    }

    private List<String> checkDangerousImports(String code) {
        List<String> foundDangerousImports = new ArrayList<>();

        Pattern importPattern = Pattern.compile(
                "\\b(?:from\\s+(\\w+(?:\\.\\w+)*)\\s+import|import\\s+(\\w+(?:\\.\\w+)*)(?:\\s+as\\s+\\w+)?)");

        Matcher matcher = importPattern.matcher(code);
        while (matcher.find()) {
            String module = matcher.group(1) != null ? matcher.group(1) : matcher.group(2);

            String baseModule = module.split("\\.")[0];

            if (dangerousModules.contains(baseModule)) {
                foundDangerousImports
                        .add("Importación no permitida del módulo potencialmente peligroso: " + baseModule);
            }
        }

        if (code.contains("__import__") ||
                code.contains("getattr") && code.contains("__") ||
                Pattern.compile("eval\\s*\\(").matcher(code).find() ||
                Pattern.compile("exec\\s*\\(").matcher(code).find()) {

            foundDangerousImports.add("Se detectaron construcciones potencialmente peligrosas en el código");
        }

        return foundDangerousImports;
    }

    private String cleanCodeForComparison(String code) {

        code = code.replaceAll("#.*$", "");
        code = code.replaceAll("\\s+", " ");
        return code.trim();
    }

    private boolean containsSum(String code) {
        Pattern pattern = Pattern.compile("(?<!['\"])\\bsum\\s*\\(");
        Matcher matcher = pattern.matcher(code);
        return matcher.find();
    }

    private boolean containsListComprehension(String code) {
        Pattern pattern = Pattern.compile("\\[.+for.+in.+\\]");
        Matcher matcher = pattern.matcher(code);
        return matcher.find();
    }

    private boolean containsRecursion(String code) {
        String functionName = extractFunctionName(code);
        if (functionName != null) {
            Pattern pattern = Pattern.compile("\\b" + functionName + "\\s*\\(");
            Matcher matcher = pattern.matcher(code);

            if (matcher.find()) {
                return matcher.find();
            }
        }
        return false;
    }

    private boolean containsFunction(String code, String functionName) {
        Pattern pattern = Pattern.compile("\\b" + functionName + "\\s*\\(");
        Matcher matcher = pattern.matcher(code);
        return matcher.find();
    }

    private String extractFunctionName(String code) {
        Pattern pattern = Pattern.compile("def\\s+(\\w+)\\s*\\(");
        Matcher matcher = pattern.matcher(code);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return null;
    }

    private static class Pair<T, U> {
        private final T first;
        private final U second;

        public Pair(T first, U second) {
            this.first = first;
            this.second = second;
        }

        public T getFirst() {
            return first;
        }

        public U getSecond() {
            return second;
        }
    }
}
