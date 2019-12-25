import core from './core.store.js';
import service from '../services/address.service';

const store = {
    state: {
        countries: []
    },
    getters: {
        allCountries: state => {
            return state.countries || [];
        },
        callingCodes: state => {
            let result = [];
            state.countries.forEach(country => {
                country.callingCodes.forEach(callingCode => {
                    if (!callingCode || result.some(r => r.callingCode == callingCode)) return;
                    result.push({
                        name: country.name,
                        callingCode: Number(callingCode.replace(" ", ''))
                    });
                });
            });

            result.sort(function (o1, o2) {
                return o1.callingCode > o2.callingCode ? 1 : o1.callingCode < o2.callingCode ? -1 : 0;
            });

            return result;
        },
        countries: state => {
            let result = [];
            state.countries.forEach(country => {
                country.callingCodes.forEach(callingCode => {
                    if (!callingCode || result.some(r => r.callingCode == callingCode)) return;
                    result.push({
                        name: country.name,
                        alpha2Code: callingCode.alpha2Code,
                        alpha3Code: callingCode.alpha3Code,
                        region: callingCode.region,
                        subregion: callingCode.subregion
                    });
                });
            });

            result.sort(function (o1, o2) {
                return o1.callingCode > o2.callingCode ? 1 : o1.callingCode < o2.callingCode ? -1 : 0;
            });

            return result;
        }
    },
    mutations: {
        setCountries: async (state) => {
            try {
                const response = await fetch('https://restcountries.eu/rest/v2/all');
                let data = await response.json();
                state.countries = data;
            } catch (error) {
                console.error(error);
            }
        }
    }
};

export default core(service, store);