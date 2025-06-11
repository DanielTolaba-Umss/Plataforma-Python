

export const Instructions = ({ instructions }) => {

    
    return (
        <div className="instructions">
            <p className="prolema">{instructions.problema}</p>
            <h4>Restricciones:</h4>
            <ul>
              <li>El código debe estar escrito en Python.</li>
              <li>Debe utilizar la función `input()` para recibir datos.</li>
              <li>Debe mostrar un saludo personalizado usando `print()`.</li>
              <li>El código debe ser ejecutable sin errores de sintaxis.</li>
            </ul>
            <h4>Casos de Prueba:</h4>
            <ul>
              <li>Entrada: "10 5" | Salida Esperada: "15"</li>
              <li>Entrada: "20 30" | Salida Esperada: "50"</li>
              <li>Entrada: "100 200" | Salida Esperada: "300"</li>
            </ul>
        </div>
    );
}