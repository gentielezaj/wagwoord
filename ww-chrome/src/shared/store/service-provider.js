import { WWUtil } from "../util/ww-util";

export class ServiceProvider {
    constructor(service) {
        this.service = service;
        this.util = WWUtil;
    }

    // #region get
    getItem(id) {
        return this.request('getItem', [id]);
    }

    get(query) {
        return this.request('get', [query]);
    }

    list(query) {
        return this.request('list', [query]);
    }
    // #endregion get

    // #region save
    save(model) {
        return this.request('save', [model]);
    }
    // #endregion save

    sync() {
        return this.request('sync');
    }

    async delete(id) {
        let response;

        if(id) {
            response = await this.request('delete', [id]);
        } else {
            response = await this.request('deleteAll');
        }

        return response;
    }

    request(action, params, service) {
        return new Promise((resolve, reject) => {
          try {
              chrome.runtime.sendMessage({
                  service: service || this.service,
                  action,
                  params
              }, function (response) {
                  if(response.success) {
                      resolve(response.data);
                  } else {
                      reject(response.error);
                  }
              });    
          } catch (error) {
              reject(error);
          }
        });
    }
}