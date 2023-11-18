
import { LLMChatAPI, LLMChatSession, LLMChatStatic, LLMMessage } from './types/llmapi'

const API_BASE = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'

type DashScopeConfig = {
    token: string,
    model?: string,
    max_tokens?: number,
    top_p?: number,
    top_k?: number,
    repetition_penalty?: number,
    temperature?: number,
    enable_search?: boolean,
}

class DashScopeSession implements LLMChatSession {
    api: DashScope
    messages: LLMMessage[]
    statics: LLMChatStatic
    constructor(api: DashScope) {
        this.api = api
        this.messages = []
        this.statics = {
            totalTokens: 0,
            promptTokens: 0,
            completionTokens: 0,
        }
    }

    makeMessages(): any[] {
        let ret = []
        for (let msg of this.messages) {
            // 防止有奇怪的role,map下 目前好像还只有这三种
            let role = {
                'user': 'user',
                'system': 'system',
                'assistant': 'assistant',
            }[msg.role]
            ret.push({
                role: role,
                content: msg.content,
            })
        }
        return ret
    }

    async request(stream: boolean): Promise<any> {
        let req = {
            model: this.api.config.model,
            input: {
                messages: this.makeMessages(),
            },
            parameters: {}
        }
        let parameters: {
            [key: string]: any
        } = {
            result_format: "message",
            incremental_output: stream,
        }
        for (let key of ['max_tokens', 'top_p', 'top_k', 'repetition_penalty', 'temperature', 'enable_search']) {
            let v = (this.api.config as { [key: string]: any })[key]
            if (v !== undefined && v !== null) {
                parameters[key] = v
            }
        }
        req.parameters = parameters

        console.log(req)
        let json = await fatchJSON(API_BASE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.api.config.token}`,
            },
            body: JSON.stringify(req)
        })
        return json
    }

    async completion() {
        let json = await this.request(false)
        // let json = await res.json()
        console.log(json)
        this.statics.completionTokens += json.usage.output_tokens
        this.statics.totalTokens += json.usage.total_tokens
        this.statics.promptTokens += json.usage.input_tokens
        return json.output.choices[0].message as LLMMessage
    }

    completionStream(): Iterable<string> {
        throw new Error("Method not implemented.");
        // return ["Hello, world!"]
    }

}

class DashScope implements LLMChatAPI {
    config: DashScopeConfig
    constructor(config: any) {
        this.config = config
        if (!this.config.model) {
            this.config.model = 'qwen-max'
        }
    }
    createSession(): DashScopeSession {
        return new DashScopeSession(this)
    }
}

export {
    DashScope,
    DashScopeConfig,
}
