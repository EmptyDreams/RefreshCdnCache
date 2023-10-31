// noinspection SpellCheckingInspection

import dcdn20180115, * as $dcdn20180115 from '@alicloud/dcdn20180115';
import * as $OpenApi from '@alicloud/openapi-client'
import * as $Util from '@alicloud/tea-util'
import ToolOptional from './config'

export interface AliOptional extends ToolOptional {
    accessKey: string,
    accessSecret: string,
    objectPaths: string[] | RegExp[],
    objectType: 'File' | 'Directory' | 'Regex' | 'IgnoreParams',
    force: boolean
}

class Client {

    /**
     * 使用AK&SK初始化账号Client
     * @param accessKeyId
     * @param accessKeySecret
     * @return Client
     * @throws Exception
     */
    static createClient(accessKeyId: string, accessKeySecret: string): dcdn20180115 {
        let config = new $OpenApi.Config({
            // 必填，您的 AccessKey ID
            accessKeyId: accessKeyId,
            // 必填，您的 AccessKey Secret
            accessKeySecret: accessKeySecret,
        });
        // Endpoint 请参考 https://api.aliyun.com/product/dcdn
        config.endpoint = `dcdn.aliyuncs.com`;
        return new dcdn20180115(config);
    }

    static async main(optional: AliOptional): Promise<void> {
        let client = Client.createClient(optional.accessKey, optional.accessSecret);
        let refreshDcdnObjectCachesRequest = new $dcdn20180115.RefreshDcdnObjectCachesRequest({
            objectPath: optional.objectPaths.map(it => it.toString()).join('\n'),
            objectType: optional.objectType,
            force: optional.force,
        });
        let runtime = new $Util.RuntimeOptions({ });
        await client.refreshDcdnObjectCachesWithOptions(refreshDcdnObjectCachesRequest, runtime)
    }

}

// noinspection JSUnusedGlobalSymbols
export async function invokeAli(optional: AliOptional): Promise<void> {
    await Client.main(optional)
}