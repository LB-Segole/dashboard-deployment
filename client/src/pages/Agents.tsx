import { useState, useEffect } from 'react';
import { Phone, Plus, Settings, Trash2, Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useAgent } from '../hooks/useAgent';
import { useCalls } from '../hooks/useCalls';

type Agent = {
  id: string;
  name: string;
  voice: string;
  language: string;
  firstMessage: string;
  isActive: boolean;
};

export const Agents = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState<Omit<Agent, 'id' | 'isActive'>>({
    name: '',
    voice: 'en-US-Wavenet-A',
    language: 'en-US',
    firstMessage: 'Hello, how can I help you today?',
  });
  const { currentCall } = useCalls();

  const { startAgent, stopAgent, state: agentState } = useAgent({
    voice: 'en-US-Wavenet-A',
    speakingRate: 1.0,
    pitch: 0,
    language: 'en-US',
  });

  useEffect(() => {
    // Simulate loading agents from API
    const loadAgents = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        setAgents([
          {
            id: '1',
            name: 'Sales Agent',
            voice: 'en-US-Wavenet-A',
            language: 'en-US',
            firstMessage: 'Thanks for calling our sales team! How can I help you?',
            isActive: false,
          },
          {
            id: '2',
            name: 'Support Agent',
            voice: 'en-US-Wavenet-B',
            language: 'en-US',
            firstMessage: 'Hello, this is support. What issue can I help with?',
            isActive: false,
          },
        ]);
      } catch (error) {
        console.error('Failed to load agents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, []);

  const handleCreateAgent = async () => {
    try {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const agent: Agent = {
        ...newAgent,
        id: `agent-${Date.now()}`,
        isActive: false,
      };
      setAgents(prev => [...prev, agent]);
      setIsModalOpen(false);
      setNewAgent({
        name: '',
        voice: 'en-US-Wavenet-A',
        language: 'en-US',
        firstMessage: 'Hello, how can I help you today?',
      });
    } catch (error) {
      console.error('Failed to create agent:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAgent = (agent: Agent) => {
    if (agent.isActive) {
      stopAgent();
    } else {
      startAgent();
    }
    setAgents(prev =>
      prev.map(a =>
        a.id === agent.id ? { ...a, isActive: !a.isActive } : a
      )
    );
  };

  const deleteAgent = (id: string) => {
    setAgents(prev => prev.filter(agent => agent.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Agents</h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Agent
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <Card key={agent.id} className="p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{agent.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => deleteAgent(agent.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button className="text-gray-400 hover:text-blue-600 transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Voice:</span>
                  <span>{agent.voice}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium mr-2">Language:</span>
                  <span>{agent.language}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">First Message:</p>
                  <p className="bg-gray-50 p-3 rounded-md">{agent.firstMessage}</p>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => toggleAgent(agent)}
                  disabled={!!currentCall}
                  className={`w-full ${agent.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {agent.isActive ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Agent"
        actionButton={
          <Button
            onClick={handleCreateAgent}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create Agent
          </Button>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700 mb-1">
              Agent Name
            </label>
            <Input
              id="agent-name"
              value={newAgent.name}
              onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
              placeholder="e.g. Sales Agent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="agent-voice" className="block text-sm font-medium text-gray-700 mb-1">
                Voice
              </label>
              <select
                id="agent-voice"
                value={newAgent.voice}
                onChange={(e) => setNewAgent({ ...newAgent, voice: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border text-sm"
              >
                <option value="en-US-Wavenet-A">Male (US)</option>
                <option value="en-US-Wavenet-B">Female (US)</option>
                <option value="en-GB-Wavenet-A">Male (UK)</option>
                <option value="en-GB-Wavenet-B">Female (UK)</option>
              </select>
            </div>
            <div>
              <label htmlFor="agent-language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                id="agent-language"
                value={newAgent.language}
                onChange={(e) => setNewAgent({ ...newAgent, language: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 border text-sm"
              >
                <option value="en-US">English (US)</option>
                <option value="en-GB">English (UK)</option>
                <option value="es-ES">Spanish</option>
                <option value="fr-FR">French</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="first-message" className="block text-sm font-medium text-gray-700 mb-1">
              First Message
            </label>
            <Input
              id="first-message"
              value={newAgent.firstMessage}
              onChange={(e) => setNewAgent({ ...newAgent, firstMessage: e.target.value })}
              placeholder="Agent's first message when call starts"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};