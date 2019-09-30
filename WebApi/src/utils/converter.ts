import { BaseEntity } from "database/models/baseEntity";

export class AppConverter {
    static Convert<T extends BaseEntity>(soruce: object, destination: new() => T): T | undefined{
        if(!soruce) return undefined;
        
        var desob = new destination();

        for(let property in soruce) {
            if(soruce.hasOwnProperty(property) && destination.hasOwnProperty(property)) {
                let objDes = <any>desob;
                let objSrc = <any>soruce;
                objDes[property] = objSrc[property];
            }
        }
        
        return undefined;
    }
}