


export class WSClient {
    constructor() {
        console.log('init ws', import.meta.env)
        const ws = new WebSocket(import.meta.env.VITE_WS_URL)
        ws.addEventListener('error', err => {
            console.error(err)
        })
        ws.addEventListener('open', () => {
            console.log('connected')
        })

    }
}
