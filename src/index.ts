import {AliOptional, invokeAli} from './ali'
import {UpyunOptional, invokeUpyun} from './upyun'
import {DogeCloudOptional, invokeDogeCloud} from './doge-cloud'

export {
    AliOptional, UpyunOptional, DogeCloudOptional
}

// noinspection JSUnusedGlobalSymbols
export const functions = Object.freeze({
    invokeAli, invokeUpyun, invokeDogeCloud
})