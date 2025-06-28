import OpenAI from 'openai';


const openai = new OpenAI({

    baseURL: import.meta.env.VITE_API_URL,
    apiKey: import.meta.env.VITE_API_KEY,
    dangerouslyAllowBrowser: true
});


const createPromptMessages = (practice, restriction, testCases, code,  result, passedAllTests) =>{
    const systemPrompt =   `Eres un tutor de programación Python que proporciona retroalimentación constructiva a estudiantes.
                            Tu objetivo es ayudar al estudiante a comprender sus errores o cómo mejorar su código, sin resolver el ejercicio por ellos.

                            IMPORTANTE: 
                            - NUNCA proporciones código completo que resuelva el problema.
                            - Enfócate en guiar al estudiante mediante pistas y explicaciones.
                            - Usa ejemplos mínimos para ilustrar conceptos cuando sea necesario.
                            - Al final de tu respuesta no ingluyas preguntas, ya que el estudiante no podrá responderlas.

                            Estructura tu retroalimentación así:
                            1. DIAGNÓSTICO: Breve resumen del estado del código (correcto pero mejorable, con errores lógicos, con errores sintácticos, etc.)
                            2. PUNTOS FUERTES: Aspectos positivos del enfoque del estudiante (si existen).
                            3. ÁREAS DE MEJORA: Identifica conceptos o implementaciones que podrían mejorarse.
                            4. SUGERENCIAS ESPECÍFICAS: Proporciona pistas claras sobre cómo solucionar problemas o mejorar el código.
                            5. CONCEPTOS RELEVANTES: Explica brevemente conceptos de Python relacionados con el ejercicio.

                            Adapta tu nivel de retroalimentación según si el código pasa los tests o no:
                            - Si pasa todos los tests: Enfócate en optimizaciones y buenas prácticas.
                            - Si no pasa los tests: Identifica la causa probable del fallo y da pistas para resolverlo.`;
    const userPrompt = `
        ENUNCIADO DEL EJERCICIO:
        ${practice}
        RESTICCIONES DEL EJERCICIO:
        ${restriction}

        CÓDIGO DEL ESTUDIANTE:
        \`\`\`python
        ${code}
        \`\`\`

        RESULTADO DE LA EJECUCIÓN:
        ${result}

        CASOS DE PRUEBA:
        ${JSON.stringify(testCases, null, 2)}

        ESTADO: ${passedAllTests ? 'El código pasó todos los tests' : 'El código NO pasó todos los tests'}

        Por favor, proporciona una retroalimentación educativa que ayude al estudiante a entender sus errores o cómo mejorar, sin resolver el problema por completo.`;
    
        return [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];
}

export const autoFeedbackService = {
    async getFeedback(
        exercisePrompt, 
        restriction,
        studentCode, 
        executionResult, 
        testCases, 
        passedAllTests
    ) {
        try {

            const prompt = createPromptMessages(
                exercisePrompt, 
                restriction, 
                testCases, 
                studentCode, 
                executionResult, 
                passedAllTests
            );



            const response = await openai.chat.completions.create({
            model: import.meta.env.VITE_API_MODEL,
                messages: [
                    { 
                        role: 'system', content: prompt[0].content
                    },
                    { 
                        role: 'user', content: prompt[1].content
                    }
                ]
            });
            return response.choices[0].message.content;
        } catch (error) {
            console.error("Error fetching feedback:", error);
            throw error;
        }
    }
};