
const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld(
    "fatchJSON",
    (...args) => ipcRenderer.invoke("cn.dixyes.llmbot.fatchJSON", ...args),
)
