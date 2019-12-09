import Dexie from 'dexie';

const db = new Dexie('wagwoord');
db.version(1).stores({
    password: '++id,name,domain,username,searchField,serverId,lastModified,encrypted,synced,count,[domain+username]',
    blacklist: '++id,&name,serverId,lastModified,synced,password,address,codeGenerator,creditCard',
    settings: '++id,&name,encrypted,lastModified,serverId,synced'
});
db.version(2).stores({
    codegenerator: '++id,issuer,username,searchField,serverId,lastModified,encrypted,synced,[issuer+username]'
});
db.version(3).stores({
    creditcard: '++id,name,cardType,expiredMonth,expiredYear,searchField,serverId,lastModified,encrypted,synced,count'
});
db.version(4).stores({
    address: '++id,firtName,lastName,birthDay,street,secundStreet,city,state,country,username,postalCode,searchField,serverId,lastModified,organization,phone,encrypted,synced,count'
});
db.version(4).stores({
    creditcard: '++id,name,cardType,expiredMonth,expiredYear,searchField,serverId,lastModified,encrypted,synced,count,&cardNumber,bank,nfc'
});
db.version(4).stores({
    address: '++id,firtName,lastName,birthDate,street,secundStreet,city,state,country,username,postalCode,searchField,serverId,lastModified,organization,phone,encrypted,synced,count'
});

export default db;