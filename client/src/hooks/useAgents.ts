import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '../services/websocket';
import { useAudio } from '../context/AudioContext';
import { AgentConfig, AgentState, Call } from '../types';

interface AgentError extends Error {
  code: string;
  details?: unknown;
}

export const useAgent = (initialConfig: AgentConfig) => {
  const [config, setConfig] = useState<AgentConfig>(initialConfig);
  const [state, setState] = useState<AgentState>('idle');
  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [error, setError] = useState<AgentError | null>(null);
  
  const { status: wsStatus, send: wsSend } = useWebSocket(
    config.websocketUrl,
    config.authToken
  );
  
  const { playAudio, stopAudio } = useAudio();

  const handleError = useCallback((error: unknown, code = 'AGENT_ERROR') => {
    const agentError: AgentError = error instanceof Error ? error : new Error('Unknown error');
    agentError.code = code;
    setError(agentError);
    setState('error');
  }, []);

  const startAgent = useCallback(async () => {
    try {
      if (state !== 'idle') {
        throw new Error('Agent can only be started from idle state');
      }

      setState('initializing');
      wsSend({
        type: 'agent.start',
        payload: {
          config,
          timestamp: Date.now()
        }
      });

      setState('active');
    } catch (error) {
      handleError(error, 'AGENT_START_ERROR');
    }
  }, [config, state, wsSend, handleError]);

  const stopAgent = useCallback(async () => {
    try {
      if (state === 'idle') {
        return;
      }

      wsSend({
        type: 'agent.stop',
        payload: {
          agentId: config.id
        }
      });

      stopAudio();
      setState('idle');
      setCurrentCall(null);
    } catch (error) {
      handleError(error, 'AGENT_STOP_ERROR');
    }
  }, [config.id, state, wsSend, stopAudio, handleError]);

  const sendMessage = useCallback(async (message: string) => {
    try {
      if (state !== 'active') {
        throw new Error('Agent must be active to send messages');
      }

      wsSend({
        type: 'agent.message',
        payload: {
          agentId: config.id,
          message,
          callId: currentCall?.id
        }
      });
    } catch (error) {
      handleError(error, 'AGENT_MESSAGE_ERROR');
    }
  }, [config.id, currentCall?.id, state, wsSend, handleError]);

  const synthesizeSpeech = useCallback(async (text: string) => {
    try {
      const response = await fetch(`${config.apiUrl}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.authToken}`
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Speech synthesis failed');
      }

      const audioData = await response.arrayBuffer();
      await playAudio(audioData);
    } catch (error) {
      handleError(error, 'SPEECH_SYNTHESIS_ERROR');
    }
  }, [config.apiUrl, config.authToken, playAudio, handleError]);

  useEffect(() => {
    if (wsStatus === 'error') {
      handleError(new Error('WebSocket connection error'), 'WEBSOCKET_ERROR');
    }
  }, [wsStatus, handleError]);

  useEffect(() => {
    if (currentCall?.status === 'ended') {
      stopAgent();
    }
  }, [currentCall?.status, stopAgent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (state !== 'idle') {
        stopAgent();
      }
    };
  }, [state, stopAgent, stopAudio]);

  return {
    config,
    state,
    error,
    currentCall,
    setConfig,
    startAgent,
    stopAgent,
    sendMessage,
    synthesizeSpeech
  };
};