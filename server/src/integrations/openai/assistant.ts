import { OpenAI } from 'openai'
import { env } from '@/env.mjs'
import { query } from '@/config/database'
import { CreateAgent } from '@/database/models/agent'

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export class OpenAIAssistant {
  private assistantId?: string

  constructor(private agentData: CreateAgent) {}

  async createAssistant() {
    const assistant = await openai.beta.assistants.create({
      name: this.agentData.name,
      description: this.agentData.persona,
      model: 'gpt-4-1106-preview',
      tools: [{ type: 'code_interpreter' }, { type: 'retrieval' }],
      instructions: `
        You are a voice AI assistant with the following persona:
        ${this.agentData.persona}

        Your communication style should be:
        - Conversational and natural
        - Concise (phone-appropriate responses)
        - Friendly but professional
        - Adapt to the user's tone

        Additional instructions:
        - Always stay in character
        - Never say you're an AI
        - Keep responses under 3 sentences unless asked for more
        - Use the provided tools when needed
      `,
      metadata: {
        voiceId: this.agentData.voice_id,
        language: this.agentData.language,
        interruptionThreshold: this.agentData.interruption_threshold.toString(),
        temperature: this.agentData.temperature.toString(),
      },
    })

    this.assistantId = assistant.id

    // Store assistant ID in database if this is a new agent
    if (this.agentData.id) {
      await query(
        'UPDATE agents SET openai_assistant_id = $1 WHERE id = $2',
        [assistant.id, this.agentData.id]
      )
    }

    return assistant
  }

  async createThread() {
    if (!this.assistantId) {
      throw new Error('Assistant not created yet')
    }
    return await openai.beta.threads.create()
  }

  async generateResponse(threadId: string, message: string) {
    if (!this.assistantId) {
      throw new Error('Assistant not created yet')
    }

    // Add user message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    })

    // Run assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: this.assistantId,
    })

    // Wait for completion
    let retrievedRun = await openai.beta.threads.runs.retrieve(
      threadId,
      run.id
    )

    while (
      retrievedRun.status !== 'completed' &&
      retrievedRun.status !== 'failed'
    ) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      retrievedRun = await openai.beta.threads.runs.retrieve(
        threadId,
        run.id
      )
    }

    if (retrievedRun.status === 'failed') {
      throw new Error('Assistant run failed')
    }

    // Get the assistant's messages
    const messages = await openai.beta.threads.messages.list(threadId)
    const assistantMessages = messages.data
      .filter((m) => m.role === 'assistant')
      .map((m) => m.content[0]?.text?.value || '')

    return assistantMessages[0] || ''
  }

  async deleteAssistant() {
    if (this.assistantId) {
      await openai.beta.assistants.del(this.assistantId)
    }
  }
}