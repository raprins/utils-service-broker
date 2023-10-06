export type CfApplication = {
    cf_api: string
    limits: {
        fds: number
    }
    application_name: string
    application_uris: Array<string>
    name: string
    space_name: string
    space_id: string
    organization_id: string
    organization_name: string
    uris: Array<string>
    users: any
    application_id: string
}

export function getApplicationMetadata():CfApplication  {
    return JSON.parse(process.env.VCAP_APPLICATION!)
}

export function getApplicationUri() {
    return getApplicationMetadata().uris[0]
}