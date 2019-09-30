export class Logger {
    public static logError(e: any, messageHeader?: string) {
        //TODO: create log file
        console.error('error on app: ' + (messageHeader || ''));
        console.log(e);
        console.log('-----------');
    }

    public static log(e: any) {
        console.log('log data');
        console.log(e);
        console.log('-----------');
    }
}