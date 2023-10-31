import * as https from 'https'
import ToolOptional from './config'

/** @see https://support.huaweicloud.com/devg-apisign/api-sign-provide-start.html */
export interface HuaweiOptional extends ToolOptional {
    enterprise_project_id?: string,
    endPoint: string,
    ak: string,
    sk: string,
    refreshType: 'file' | 'directory',
    mode: 'all' | 'detect_modify_refresh',
    urls: string[]
}

// noinspection JSUnusedGlobalSymbols
export async function invokeHuawei(optional: HuaweiOptional): Promise<void> {
    if (optional.type != 'huawei') throw '配置类型错误'
    const Signer = require('./lib/huawei-api.js')
    // noinspection JSUnresolvedReference
    const sig = new Signer.Signer()
    sig.Key = optional.ak
    sig.Secret = optional.sk
    const enterPriseProjectId = optional.enterprise_project_id ? '?enterprise_project_id=' + optional.enterprise_project_id : ''
    // noinspection JSUnresolvedReference
    const req = new Signer.HttpRequest('POST', `${optional.endPoint}/v1.0/cdn/content/refresh-tasks${enterPriseProjectId}`)
    req.headers = {
        "Content-Type": "application/json"
    }
    req.body = encodeURIComponent(JSON.stringify({
        refresh_task: {
            type: optional.refreshType,
            mode: optional.mode,
            zh_url_encode: false,
            urls: optional.urls.join(',')
        }
    }))
    const opt = sig.Sign(req)
    return new Promise((resolve, reject) => {
        const request = https.request(opt, res => {
            if (res.statusCode !== 200) reject(`连接失败：${res.statusCode}`)
            res.on('data', chunk => {
                resolve()
            })
        })
        request.on('error', err => reject(err))
        request.write(req.body)
        request.end()
    })
}