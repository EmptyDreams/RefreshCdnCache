import {AliOptional, invokeAli} from './ali'
import {HuaweiOptional, invokeHuawei} from './huawei'
import {UpyunOptional, invokeUpyun} from './upyun'
import {DogeCloudOptional, invokeDogeCloud} from './doge-cloud'

export function refreshAli(optional: AliOptional) {
    optional.type = 'ali'
    return invokeAli(optional)
}

export function refreshHuawei(optional: HuaweiOptional) {
    optional.type = 'huawei'
    return invokeHuawei(optional)
}

export function refreshUpyun(optional: UpyunOptional) {
    optional.type = 'upyun'
    return invokeUpyun(optional)
}

export function refreshDogeCloud(option: DogeCloudOptional) {
    option.type = 'doge-cloud'
    return invokeDogeCloud(option)
}