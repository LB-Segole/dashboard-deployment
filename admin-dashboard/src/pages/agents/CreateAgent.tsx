import { useNavigate } from 'react-router-dom';
import { useAgentManagement } from '@/hooks/useAgentManagement';
import { agentConfigSchema } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Form, FormField } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Slider } from '@/components/ui/Slider';
import { Icons } from '@/components/Icons';
import React, { useState } from 'react';

type FormData = z.infer<typeof agentConfigSchema>;

export const CreateAgent = () => {
  const navigate = useNavigate();
  const { addAgent } = useAgentManagement();
  const [isCreating, setIsCreating] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(agentConfigSchema),
    defaultValues: {
      name: '',
      voice: 'neutral',
      language: 'en-US',
      initialMessage: '',
      interruptionThreshold: 0.5,
      sentimentAnalysis: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsCreating(true);
    try {
      const newAgent = await addAgent(data);
      navigate(`/agents/${newAgent.id}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Agent</h1>
        <Button
          variant="outline"
          onClick={() => navigate('/agents')}
        >
          Cancel
        </Button>
      </div>

      <Form>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField name="name">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Agent Name *</label>
              <Input placeholder="Sales Agent" {...form.register('name')} />
              <p className="text-xs text-slate-500">Give your agent a descriptive name</p>
            </div>
          </FormField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField name="voice">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">Voice *</label>
                <Select
                  value={form.watch('voice')}
                  onChange={e => form.setValue('voice', e.target.value)}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'neutral', label: 'Neutral' },
                  ]}
                />
              </div>
            </FormField>

            <FormField name="language">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">Language *</label>
                <Select
                  value={form.watch('language')}
                  onChange={e => form.setValue('language', e.target.value)}
                  options={[
                    { value: 'en-US', label: 'English (US)' },
                    { value: 'es-ES', label: 'Spanish' },
                    { value: 'fr-FR', label: 'French' },
                    { value: 'de-DE', label: 'German' },
                  ]}
                />
              </div>
            </FormField>
          </div>

          <FormField name="initialMessage">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">Initial Message *</label>
              <Input
                placeholder="Hello, how can I help you today?"
                {...form.register('initialMessage')}
              />
              <p className="text-xs text-slate-500">This will be the first thing your agent says when a call starts</p>
            </div>
          </FormField>

          <FormField name="interruptionThreshold">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-slate-700">
                Interruption Threshold: {form.watch('interruptionThreshold').toFixed(1)}s
              </label>
              <Slider
                min={0.1}
                max={2.0}
                step={0.1}
                value={form.watch('interruptionThreshold')}
                onChange={e => form.setValue('interruptionThreshold', Number(e.target.value))}
              />
              <p className="text-xs text-slate-500">How long to wait before allowing the agent to interrupt the caller</p>
            </div>
          </FormField>

          <FormField name="sentimentAnalysis">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-slate-700">Sentiment Analysis</label>
                <p className="text-xs text-slate-500">Enable real-time sentiment detection during calls</p>
              </div>
              <Switch
                checked={form.watch('sentimentAnalysis')}
                onCheckedChange={val => form.setValue('sentimentAnalysis', val)}
              />
            </div>
          </FormField>

          <div className="flex justify-end">
            <Button type="submit" disabled={isCreating}>
              {isCreating && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Agent
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};