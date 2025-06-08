import React, { useState, useEffect, useRef } from 'react';
import './LiveTranscription.css';

const LiveTranscription = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [language, setLanguage] = useState('es-ES');
  
  const recognitionRef = useRef(null);
  const transcriptRef = useRef('');
  const transcriptAreaRef = useRef(null);

  // Verificar soporte del navegador
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;
      
      // Configuración
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;
      
      // Eventos
      recognition.onstart = () => {
        console.log('🎤 Transcripción iniciada');
      };
      
      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }
          if (final) {
          transcriptRef.current += final;
          setTranscript(transcriptRef.current);
          setInterimTranscript('');
          
          // Auto-scroll hacia abajo
          setTimeout(() => {
            if (transcriptAreaRef.current) {
              transcriptAreaRef.current.scrollTop = transcriptAreaRef.current.scrollHeight;
            }
          }, 50);
        } else {
          setInterimTranscript(interim);
        }
      };
        recognition.onerror = (event) => {
        console.error('❌ Error en reconocimiento de voz:', event.error);
        setIsListening(false);
        
        switch(event.error) {
          case 'no-speech':
            console.log('ℹ️ No se detectó voz durante un tiempo');
            break;
          case 'aborted':
            console.log('ℹ️ Reconocimiento cancelado');
            break;
          case 'audio-capture':
            alert('❌ Error al acceder al micrófono. Verifica que esté conectado y funcionando.');
            break;
          case 'not-allowed':
            alert('❌ Permisos de micrófono denegados. Por favor, permite el acceso al micrófono.');
            break;
          case 'network':
            alert('❌ Error de red. Verifica tu conexión a internet.');
            break;
          default:
            console.log('❌ Error de reconocimiento:', event.error);
        }
      };
        recognition.onend = () => {
        console.log('🔇 Transcripción detenida');
        setIsListening(false);
        
        // Si se detuvo inesperadamente y aún debería estar escuchando, reiniciar
        if (isListening && recognitionRef.current) {
          setTimeout(() => {
            try {
              recognitionRef.current.start();
              setIsListening(true);
            } catch (error) {
              console.log('Error al reiniciar reconocimiento:', error);
            }
          }, 100);
        }      };
    }
  }, [language, isListening]);const startListening = async () => {
    if (recognitionRef.current && !isListening) {
      try {
        // Verificar permisos de micrófono primero
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Cerrar el stream de prueba
        
        // Pequeña pausa para que el navegador procese los permisos
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Configurar el reconocimiento antes de iniciar
        recognitionRef.current.lang = language;
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        // Iniciar reconocimiento
        recognitionRef.current.start();
        setIsListening(true);
        transcriptRef.current = transcript;
        
        console.log('✅ Reconocimiento iniciado correctamente');
      } catch (error) {
        console.error('❌ Error al iniciar reconocimiento:', error);
        if (error.name === 'NotAllowedError') {
          alert('🎤 Necesitas permitir el acceso al micrófono para usar la transcripción');
        } else if (error.name === 'NotFoundError') {
          alert('🎤 No se encontró ningún micrófono en tu dispositivo');
        } else {
          alert('❌ Error al iniciar la transcripción: ' + error.message);
        }
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    transcriptRef.current = '';
  };
  const saveTranscript = () => {
    if (transcript.trim()) {
      const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transcripcion_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      alert('💾 Transcripción descargada como archivo .txt');
    }
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('📋 Texto copiado al portapapeles');
    });
  };

  if (!isSupported) {
    return (
      <div className="transcription-container">
        <div className="error-message">
          <h3>❌ Reconocimiento de voz no soportado</h3>
          <p>Tu navegador no soporta Web Speech API.</p>
          <p>Prueba con Chrome, Edge o Safari.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="transcription-container">
      <div className="transcription-header">
        <h4>🎤 Transcripción</h4>
        <div className="controls">
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isListening}
            className="language-select"
          >
            <option value="es-ES">🇪🇸 ES</option>
            <option value="en-US">🇺🇸 EN</option>
            <option value="fr-FR">🇫🇷 FR</option>
            <option value="de-DE">🇩🇪 DE</option>
            <option value="it-IT">🇮🇹 IT</option>
            <option value="pt-BR">🇧🇷 PT</option>
          </select>
          
          <button
            onClick={isListening ? stopListening : startListening}
            className={`mic-button ${isListening ? 'listening' : ''}`}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>
        </div>
      </div>

      <div className="transcript-display" ref={transcriptAreaRef}>
        <div className="transcript-content">
          <span className="final-text">{transcript}</span>
          <span className="interim-text">{interimTranscript}</span>
          {isListening && <span className="cursor">|</span>}
        </div>
        
        {isListening && (
          <div className="listening-indicator">
            <div className="pulse"></div>
            <span>Escuchando...</span>
          </div>
        )}
        
        {!transcript && !isListening && (
          <div className="placeholder">
            Haz clic en 🎤 para empezar a transcribir
          </div>
        )}
      </div>

      <div className="transcript-actions">
        <button onClick={clearTranscript} className="action-btn clear-btn" title="Limpiar">
          🗑️
        </button>
        <button onClick={saveTranscript} className="action-btn save-btn" disabled={!transcript.trim()} title="Descargar .txt">
          💾
        </button>
        <button onClick={() => copyToClipboard(transcript)} className="action-btn copy-btn" disabled={!transcript.trim()} title="Copiar">
          📋
        </button>
      </div>
    </div>
  );
};

export default LiveTranscription;
