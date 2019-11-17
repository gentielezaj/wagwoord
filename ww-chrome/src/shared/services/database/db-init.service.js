import Dexie from 'dexie';

const db = new Dexie('wagwoord');
db.version(1).stores({
    password: '++id,name,domain,username,searchField,serverId,lastModified,encrypted,synced,count',
    blacklist: '++id,&name,serverId,lastModified,synced,password,address,codeGenerator,creditCard',
    settings: '++id,&name,encrypted,lastModified,serverId,synced'
});

export default db;