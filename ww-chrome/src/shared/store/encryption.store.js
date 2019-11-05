import EncryptionService from '../services/encryprion.service';

export default {
    namespaced: true,
    state: {
        encryption: new EncryptionService()
    },
    getters: {
        model: async state => await state.encryption.get(),
        encryptionKey: async state => await state.encryption.get('encryptionKey'),
        encryptLocal: async state => await state.encryption.get('encryptLocal'),
        encrypt: state => async text => await state.encryption.encrypt(text),
        decrypt: state => async text => await state.encryption.decrypt(text)
    },
    actions: {
        save: async (context, value) => {
            try {
                const results = await context.state.encryption.save(value);
                context.commit('refresh');
                return results;
            } catch (error) {
                console.error(error);
                return false;
            }
        }
    },
    mutations: {
        refresh: (state) => {
            state.encryption = new EncryptionService();
        }
    }
};