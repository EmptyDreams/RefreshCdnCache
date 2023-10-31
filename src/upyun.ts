import * as crypto from 'crypto'
import fetch from 'node-fetch'
import ToolOptional from './config'

export interface UpyunOptional extends ToolOptional {
    urls: string[],
    username: string,
    password: string
}

// noinspection JSUnusedGlobalSymbols
export async function invokeUpyun(optional: UpyunOptional): Promise<void> {
    if (optional.type != 'upyun') throw '配置类型错误'
    const [token, name] = await createToken(optional)
    // noinspection SpellCheckingInspection
    const response = await fetch('https://api.upyun.com/buckets/purge/batch', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            noif: 1,
            source_url: optional.urls.join('\n')
        })
    })
    if (!response.ok) throw `连接失败：${response.status}`
    const json = await response.json()
    if (json.code != 1)
        throw `发生错误，错误码为：${json.code}，详细信息查看 https://api.upyun.com/doc#/api/operation/cache/POST%20%2Fbuckets%2Fpurge%2Fbatch`
    await deleteToken(name)
}

/** 创建一个又拍云的 token */
async function createToken(optional: UpyunOptional): Promise<[string, string]> {
    let code = ''
    for (let i = 0; i !== 32; ++i) {
        code += crypto.randomInt(0, 36).toString(36)
    }
    const name = `cdn refresher at ${new Date().toLocaleString()}`
    const response = await fetch('https://api.upyun.com/oauth/tokens', {
        method: 'POST',
        body: JSON.stringify({
            username: optional.username,
            password: optional.password,
            code, name,
            scope: 'cache',
            expired_at: Math.floor(Date.now() / 1000) + 600
        })
    })
    if (!response.ok) throw `创建 token 时连接失败：${response.status}`
    const json = await response.json()
    if (!('access_token' in json)) throw json
    return [json['access_token'], name]
}

/** 删除又拍云 token */
async function deleteToken(name: string): Promise<void> {
    const response = await fetch(
        `https://api.upyun.com/oauth/tokens?name=${encodeURIComponent(name)}token`,
        {method: 'DELETE'}
    )
    if (!response.ok) throw `删除 token 时连接失败：${response.status}`
    const json = await response.json()
    if (!json.result) throw json
}