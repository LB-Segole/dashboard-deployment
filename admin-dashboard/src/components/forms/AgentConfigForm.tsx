import React from 'react';
import { useForm } from 'react-hook-form';
import { AgentConfig } from '@/types/admin';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';

interface AgentConfigFormProps {
  initialData?: Partial<AgentConfig>;
  onSubmit: (data: Partial<AgentConfig>) => void;
  isLoading?: boolean;
}

export const AgentConfigForm: React.FC<AgentConfigFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const { register, handleSubmit, watch, setValue } = useForm<AgentConfig>({
    defaultValues: {
      name: '',
      language: 'en-US',
      voice: 'neutral',
      initialMessage: 'Hello, how can I help you today?',
      interruptionThreshold: 1000,
      sentimentAnalysis: true,
      ...initialData,
    },
  });

  const watchedValues = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField label="Name">
        <Input {...register('name')} placeholder="Agent name" />
      </FormField>

      <FormField label="Voice">
        <Select
          value={watchedValues.voice}
          onValueChange={(value) => setValue('voice', value as 'neutral' | 'male' | 'female')}
          options={[
            { value: 'neutral', label: 'Neutral' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
          ]}
        />
      </FormField>

      <FormField label="Language">
        <Select
          value={watchedValues.language}
          onValueChange={(value) => setValue('language', value)}
          options={[
            { value: 'en-US', label: 'English (US)' },
            { value: 'en-GB', label: 'English (UK)' },
            { value: 'es-ES', label: 'Spanish' },
            { value: 'fr-FR', label: 'French' },
          ]}
        />
      </FormField>

      <FormField label="Initial Message">
        <Input
          {...register('initialMessage')}
          placeholder="Enter the initial greeting message"
        />
      </FormField>

      <FormField label="Interruption Threshold (ms)">
        <Input
          type="number"
          {...register('interruptionThreshold', { valueAsNumber: true })}
          placeholder="Enter threshold in milliseconds"
        />
      </FormField>

      <FormField label="Enable Sentiment Analysis">
        <input
          type="checkbox"
          checked={watchedValues.sentimentAnalysis}
          onChange={(e) => setValue('sentimentAnalysis', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default AgentConfigForm;
