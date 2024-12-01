import {UpyunOptional, invokeUpyun} from './upyun'
import {DogeCloudOptional, invokeDogeCloud} from './doge-cloud'

export function refreshUpyun(optional: UpyunOptional) {
    optional.type = 'upyun'
    return invokeUpyun(optional)
}

export function refreshDogeCloud(option: DogeCloudOptional) {
    option.type = 'doge-cloud'
    return invokeDogeCloud(option)
}