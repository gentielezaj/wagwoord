// notification store - notification

export default {
    namespaced: true,
    state: {
        notifications: []
    },
    getters: {
        notifications: state => state.notifications ? state.notifications : []
    },
    actions: {
        notify: (context, value) => {
            value.id = new Date().getTime();
            context.commit('notify', value);
            setTimeout(() => {
                context.commit('remove', value.id);
            }, 5000);
        }
    },
    mutations: {
        notify: (state, value) => {
            if(!value.id) value.id = new Date().getTime();
            value.type += ' removed';
            state.notifications.push(value);
            setTimeout(() => {
                value.type = value.type.replace(' removed', '');
            }, 100);
            if(value.error) console.error(value.error);
        },
        remove: (state, id) => {
            let i = 0;
            for (;i < state.notifications.length; i++) {
                if(state.notifications[i].id == id) break;
            }
            if(i >= state.notifications.length) return;

            state.notifications[i].type += ' removed';

            setTimeout(() => {
                state.notifications.splice(i, 1);
            }, 200);
        }
    }
};
