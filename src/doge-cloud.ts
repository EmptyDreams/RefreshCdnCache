import * as crypto from 'crypto'
import ToolOptional from './config'
import fetch from 'node-fetch'

export interface DogeCloudOptional extends ToolOptional {
    accessKey: string,
    secretKey: string,
    // noinspection SpellCheckingInspection
    /** 刷新类型 */
    rtype: 'path' | 'url' | 'prefetch',
    urls: string[]
}

// noinspection JSUnusedGlobalSymbols
export async function invokeDogeCloud(optional: DogeCloudOptional): Promise<void> {
    if (optional.type != 'doge-cloud') throw '配置类型错误'
    const {accessKey, secretKey} = optional
    // noinspection SpellCheckingInspection
    const body = JSON.stringify({
        accessKey: optional.accessKey,
        secretKey: optional.secretKey,
        rtype: optional.rtype,
        urls: optional.urls.join(',')
    })
    const sign = crypto.createHmac('sha1', secretKey)
        .update(Buffer.from(`/cdn/refresh/add.json\n${body}`, 'utf-8'))
        .digest('hex')
    const authorization = `TOKEN ${accessKey}:${sign}`
    const response = await fetch('https://api.dogecloud.com/cdn/refresh/add.json', {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': authorization
        }
    })
    if (!response.ok) throw `连接失败：${response.status}`
    const json = await response.json()
    if (!('code' in json) || json.code != 200) throw json
}