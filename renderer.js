
// // console.log('renderer.js')
// // const config = require("./config.json")
// // // import config from "./config.json"
// // // const { DashScope } = require("./dist/dashscope.js")
// // console.log(2)
// // const { LLMChatBot } = require("./dist/llmchatbot.js")
// // console.log(3)
// // import config from "./config.json"

// // console.log("onload")

// let startBot = async () => {
//     llmbotstartup(await LLAPI.getAccountInfo())

//     LLAPI.on("new-messages", (messages) => {
//         console.log(messages)
//         // 洗掉不能序列化的东西
//         let m = JSON.parse(JSON.stringify(messages))
//         console.log(m)
//         llmbotonMessage(m)
//     })

//     ipcRenderer.on("cn.dixyes.llmbot.sendMessage", (event, peer, elements) => {
//         console.log("sendMessage", peer, elements)
//         LLAPI.sendMessage(peer, elements)
//     })    
// }

// let onLoadx = () => {

//     let div = document.createElement("div")
//     div.setAttribute('style', buttonStyle)
//     div.innerHTML = "日"

//     div.addEventListener("click", (e) => {
//         console.log("registering llmchat")
//         startBot()
//         document.body.removeChild(e.target)
//     })
//     document.body.appendChild(div)


//     // // div.appendChild(div)
//     // let i = setInterval(()=>{
//     //     console.log("check LLAPI")
//     //     if (typeof LLAPI !== 'undefined') {
//     //         console.log("registering llmchat")
//     //         main().catch(console.error)
//     //         clearInterval(i)
//     //     } else {
//     //         console.log("LLAPI not ready")
//     //     }
//     // }, 1000)
// }

import { DashScope } from "./dist/dashscope.js"
import { LLMChatBot } from "./dist/llmchat.js"
import config from "./config.mjs"

let startBot = () => {
    let localConfig = config
    localConfig.llm = new DashScope(config.llm)

    let bot = new LLMChatBot(localConfig)
    bot.init()

    LLAPI.on("new-messages", async (messages) => {
        for (let msg of messages) {
            await bot.onMessage(msg)
        }
    })
}

const buttonStyle = "position: fixed; bottom: 10px; right: 10px; width: 3em; height: 3em; border: 2px solid black; background: cornsilk; color: darkcyan; border-radius: 4px;text-align: center; margin: auto; padding: 16px; font-size: 1.4em;"

let onLoad = async () => {
    console.log("renderer onload")
    console.log(document)

    if (typeof document === 'undefined') {
        console.log("renderer abort: document not exist")
        return
    }
    let div = document.createElement("div")
    div.setAttribute('style', buttonStyle)
    div.innerHTML = "日"

    div.addEventListener("click", (e) => {
        console.log("registering llmchat")
        startBot()
        document.body.removeChild(e.target)
    })
    document.body.appendChild(div)

    console.log("renderer done")
}

export {
    onLoad
}
