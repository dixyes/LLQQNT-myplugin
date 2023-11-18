type Peer = {
    uid: string,
    guildId?: string,
    chatType: 'friend' | 'group',
}

type TextMessageElement = {
    type: "text",
    content: string,
    raw?: any,
}

type ImageMessageElement = {
    type: "image",
    file: string,
    raw?: any,
}

type MessageElement = TextMessageElement | ImageMessageElement

type AccountInfo = {
    uid: string,
    uin: string,
}

type Message = {
    allDownloadedPromise: Promise<any>, // 不知道是啥 猜它是图片下载的promise
    elements: MessageElement[],
    peer: Peer,
    raw: any,
    sender: Peer,
}

declare const LLAPI: {
    // on(event: "new-messages" | "dom-up-messages" | "context-msg-menu", callback: (messages: Message[]) => void): void
    sendMessage(peer: Peer, elements: MessageElement[]): Promise<void>
    getAccountInfo(): Promise<AccountInfo>
}
