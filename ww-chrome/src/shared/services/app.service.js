import ChromeService from "./chrome.service";

export default class AppService {
    constructor() {
        this.chromeService = new ChromeService();
    }

    async isSetUp() {
        
    }
}