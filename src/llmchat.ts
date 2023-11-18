import { ChatBot } from "./types/chatbot"
import { LLMChatAPI, LLMChatSession, LLMMessage } from "./types/llmapi"


type LLMChatBotConfig = {

    botName: string,
    allowUIDs: string[],
    allowGroups: string[],

    llm: LLMChatAPI,
    groupPrompt: string,
    privatePrompt: string,
}

class LLMChatBot implements ChatBot {
    config: LLMChatBotConfig
    sessions: {
        [uid: string]: LLMChatSession
    }
    selfAccount: AccountInfo
    constructor(config: LLMChatBotConfig) {
        this.config = config
        this.sessions = {}
        this.selfAccount = {} as AccountInfo
    }

    async init() {
        this.selfAccount = await LLAPI.getAccountInfo()
    }

    // TODO: restore sessions from db
    async restoreSessions(): Promise<typeof this.sessions> {
        throw new Error("Method not implemented.")
    }

    async llmReply(msg: Message, textMessage: string, type: 'group' | 'private') {
        console.log(`llmReply to ${textMessage}`)
        let sess = this.sessions[msg.peer.uid]
        if (!sess) {
            sess = this.sessions[msg.peer.uid] = this.config.llm.createSession()

            sess.messages = [
                {
                    role: "system",
                    content: type === "group" ? this.config.groupPrompt : this.config.privatePrompt,
                },
            ]
        }

        let message: LLMMessage = {
            role: "user",
            content: textMessage,
        }

        sess.messages.push(message)

        let completion = await sess.completion()

        LLAPI.sendMessage(msg.peer, [
            {
                type: "text",
                content: completion.content,
            }
        ])

    }

    isAtMe(msg: Message): boolean {
        for (let elem of msg.elements) {
            console.log(elem.raw.textElement.atNtUid, this.selfAccount.uid)
            if (
                elem.type === "text" &&
                elem.raw.textElement.atNtUid == this.selfAccount.uid
            ) {
                // at me
                return true
            }
        }
        return false
    }

    async onMessage(msg: Message) {
        console.log(msg)
        if (msg.peer.chatType === "group") {
            if (!(this.config.allowGroups.includes(msg.peer.uid))) {
                console.log(`not allowed grp ${msg.peer.uid}`)
                return
            }
            if (!this.isAtMe(msg)) {
                console.log("not at me")
                return
            }
        } else {
            if (!(this.config.allowUIDs.includes(msg.peer.uid))) {
                console.log(`not allowed uid ${msg.peer.uid}`)
                return
            }
        }

        let textMessage = msg.elements.map(elem => {
            if (elem.type === "text") {
                return elem.content
            } else {
                return ""
            }
        }).join("")

        if (textMessage === "") {
            console.log("no text")
            return
        }

        if (textMessage.startsWith("!") || textMessage.startsWith("！")) {
            console.log("command")

            let commandLine = textMessage.slice(1)
            // TODO: real command parser
            let sess = this.sessions[msg.peer.uid]
            switch (commandLine) {
                case 'reset':
                    if (sess) {
                        delete this.sessions[msg.peer.uid]
                    }
                    LLAPI.sendMessage(msg.peer, [
                        {
                            type: "text",
                            content: "会话已重置",
                        }
                    ])
                    break
                case 'stat':
                    if (!sess) {
                        LLAPI.sendMessage(msg.peer, [
                            {
                                type: "text",
                                content: "会话不存在",
                            }
                        ])
                        return
                    }
                    LLAPI.sendMessage(msg.peer, [
                        {
                            type: "text",
                            content: `总token数: ${sess.statics.promptTokens ?? 0}`,
                        }
                    ])
                    break
                default:
                    LLAPI.sendMessage(msg.peer, [
                        {
                            type: "text",
                            content: "喵喵喵？",
                        }
                    ])
                    break
            }

            return
        }
        await this.llmReply(msg, textMessage, "group")
    }
}

export {
    LLMChatBot,
    LLMChatBotConfig,
}
