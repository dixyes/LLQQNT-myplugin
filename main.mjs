
import { ipcMain } from 'electron'
// import { DashScope } from './dist/dashscope.js'
// import { LLMChatBot } from './dist/llmchat.js'

// import config from "./config.mjs"

// let localConfig = null
// let bot = null

// let onBrowserWindowCreated = async (window, plugin) => {
//     console.log("main start")
//     if (localConfig) {
//         console.log("main bot already started")
//         return
//     }

//     // prepare bot
//     localConfig = config
//     localConfig.llm = new DashScope(config.llm)
//     let accountInfo
//     let senderWindow
//     let mainLLAPI = {
//         sendMessage: async (peer, elements) => {
//             console.log("main sendMessage", peer, elements)
//             await senderWindow.send("cn.dixyes.llmbot.sendMessage", peer, elements)
//             console.log("main sendMessage done", peer, elements)
//         },
//         getAccountInfo: async () => {
//             return accountInfo
//         }
//     }
//     localConfig.llapi = mainLLAPI
 
//     mainLLAPI.sendMessage("????")
//     ipcMain.handle("cn.dixyes.llmbot.debug", async (event, a) => {
//         console.log("debug", event.sender, window.webContents)
//         await event.sender.send("cn.dixyes.llmbot.cao", "xx", a)
//         await window.webContents.send("cn.dixyes.llmbot.cao", "xx", a)
//         console.log("done debug", event, a)
//     })

//     // console.log(await mainLLAPI.getAccountInfo())
//     ipcMain.handle("cn.dixyes.llmbot.startup", async (event, i) => {
//         accountInfo = i

//         console.log("bot startup", accountInfo, senderWindow)

//         bot = new LLMChatBot(localConfig)
//         ipcMain.handle("cn.dixyes.llmbot.onMessage", async (event, messages) => {
//             senderWindow = event.sender
//             for (let msg of messages) {
//                 await bot.onMessage(msg)
//             }
//         })
//     })

//     console.log("main done")
// }

// export {
//     onBrowserWindowCreated
// }

let onLoad = () => {
    console.log("main onload")

    ipcMain.handle("cn.dixyes.llmbot.fatchJSON", async (event, url, options) => {
        console.log("fatchJSON", url, options)
        let ret = await fetch(url, options)
        return await ret.json()
    })

    console.log("main onload done")
}

export {
    onLoad
}