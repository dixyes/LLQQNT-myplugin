
interface ChatBot {
    onMessage(message: Message): Promise<void>
}

export { ChatBot }
