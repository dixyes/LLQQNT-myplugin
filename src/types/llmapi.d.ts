type LLMChatStatic = {
    totalTokens: number
    promptTokens: number
    completionTokens: number
}

type LLMMessage = {
    role: string
    content: string
}

interface LLMChatSession {
    messages: LLMMessage[]
    statics: LLMChatStatic
    completion(): Promise<LLMMessage>
    completionStream(): Iterable<string>
}

interface LLMChatAPI {
    createSession(): LLMChatSession
}

export {
    LLMChatAPI,
    LLMChatSession,
    LLMMessage,
    LLMChatStatic,
}