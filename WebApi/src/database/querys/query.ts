import { ObjectLiteral } from "typeorm";

export declare class AppQueryBuilder 
{
    select?: Array<string> | string;

    take?: number;
    skip?: number;
    
    where?: AppQueryWhere;

    order?: AppQueryOrder | Array<AppQueryOrder>;
}

export declare class AppQueryOrder {
    property: string;
    order?: 'ASC' | 'DESC';
    nulls?: "NULLS FIRST" | "NULLS LAST";
}

@Reflect.metadata('name', 'AppQueryWhere')
export declare class AppQueryWhere {
    sql: string;
    params: ObjectLiteral;
    where?: AppQueryWhereCollection;
}

export declare class AppQueryWhereCollection {
    operation: 'and' | 'or';
    where: AppQueryWhere[];
}

export class AppQueryChecker {
    public static hasQuery(item: string | AppQueryWhere | AppQueryOrder | Array<any> | undefined | null):boolean {
        if(!item) return false;

        if(Array.isArray(item) && !item.length) return false;

        if(typeof item === 'string' && !item.length) return false;

        return true;
    }

    public static buildWhere(query: AppQueryWhere): {sql: string, params:ObjectLiteral} {
        let whereSql = query.sql;
        let params = query.params;
        if(query.where) {
            let whereSqls = [];
            query.where.where.forEach(w => {
                const wr = AppQueryChecker.buildWhere(w);
                whereSqls.push(wr.sql);
                for (const key in wr.params) {
                    if (wr.params.hasOwnProperty(key)) {
                        params[key] = wr.params[key];
                    }
                }
            });
        }

        return {sql: whereSql, params: params};
    }
}