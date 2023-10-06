import { OsbService, OsbServiceConfiguration } from "@raprincis/service-broker";
import { ProvisionRequest, CreateProvisioning, Provision } from "@raprincis/service-broker";
import fs from "node:fs"

/** For the sake of visibility */
type InstanceId = string

export default class DateUtilities extends OsbService {

    instances: Map<InstanceId, any> = new Map()
    constructor(config: OsbServiceConfiguration, private appUrl: string) {
        super(config)
    }

   
    provision(request: ProvisionRequest<CreateProvisioning>): Provision {
        const instance = this.instances.get(request.instance_id)

        this.instances.set(request.instance_id, request)

        const {service_id, plan_id, instance_id} = request
        this.emit("provisioned", {service_id, plan_id, instance_id})
        return {
            dashboard_url: this.appUrl
        }
    }
    
}

export function getFileServiceConfiguration(path: string) {
    const configFile = fs.readFileSync(path)
    return JSON.parse(configFile.toString()) as OsbServiceConfiguration
}