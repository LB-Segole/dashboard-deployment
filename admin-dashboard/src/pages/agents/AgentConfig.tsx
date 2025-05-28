import { useState, useEffect } from 'react';
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

type FormData = z.infer<typeof agentConfigSchema>;

export const AgentConfig = ({ agentId }: { agentId: string }) => {
  const { selectedAgent, updateAgentConfig, loading } = useAgentManagement();
  const [isSaving, setIsSaving] = useState(false);

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

  useEffect(() => {
    if (selectedAgent) {
      form.reset({
        ...selectedAgent,
      });
    }
  }, [selectedAgent, form]);

  const onSubmit = async (data: FormData) => {
    if (!agentId) return;
    setIsSaving(true);
    try {
      await updateAgentConfig(agentId, data);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Agent Configuration</h2>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSaving || loading}
        >
          {isSaving && <Icons.spinner />}
          Save Changes
        </Button>
      </div>

      <Form>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField label="Agent Name">
            <div className="grid gap-2">
              <Input placeholder="Sales Agent" {...form.register('name')} />
            </div>
          </FormField>

          <FormField label="Voice">
            <div className="grid gap-2">
              <Select
                value={form.watch('voice') as 'male' | 'female' | 'neutral'}
                onChange={e => form.setValue('voice', e.target.value as 'male' | 'female' | 'neutral')}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'neutral', label: 'Neutral' },
                ]}
              />
            </div>
          </FormField>

          <FormField label="Language">
            <div className="grid gap-2">
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

          <FormField label="Initial Message">
            <div className="grid gap-2">
              <Input
                placeholder="Hello, how can I help you today?"
                {...form.register('initialMessage')}
              />
              <p className="text-xs text-slate-500">This will be the first thing your agent says when a call starts</p>
            </div>
          </FormField>

          <FormField label="Interruption Threshold">
            <div className="grid gap-2">
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={form.watch('interruptionThreshold')}
                onChange={e => form.setValue('interruptionThreshold', Number(e.target.value))}
              />
            </div>
          </FormField>

          <FormField label="Sentiment Analysis">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-slate-700">Sentiment Analysis</label>
                <p className="text-xs text-slate-500">Enable real-time sentiment analysis during calls</p>
              </div>
              <Switch
                checked={form.watch('sentimentAnalysis')}
                onChange={e => form.setValue('sentimentAnalysis', e.target.checked)}
              />
            </div>
          </FormField>
        </form>
      </Form>
    </div>
  );
};