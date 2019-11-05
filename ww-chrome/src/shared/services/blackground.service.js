import PasswordService from "./passwords/password.service";
import BlacklistService from "./blacklist/blacklist.service";
import {
    getName
} from './core/helper.service';

export default class BackgroundService {
    constructor() {
        this.$password = new PasswordService();
        this.$blacklist = new BlacklistService();
    }

    async getDataFroDomain(url) {
        url = getName(url, true);
        const passwords = await this.$password.get({
            searchText: `${url}-`
        });
        const blacklist = await this.$blacklist.getItem({
            name: url
        });
        const passwordSettings = await this.$password.settings.get();

        return {
            passwords,
            blacklist,
            settings: {
                password: passwordSettings
            }
        };
    }

    async sync() {
        await this.$password.sync();
        await this.$blacklist.sync();
    }
}