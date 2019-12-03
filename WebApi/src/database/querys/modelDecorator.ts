export function Identifier(): Function {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let val = Reflect.getMetadata('Identifier', target) || [];
        val.push(propertyKey);
        Reflect.defineMetadata('Identifier', val, target);
    }
}