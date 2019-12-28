import core from './core.store.js';
import service from '../services/address.service';

const store = {
    state: {
        countries: [],
        userLocation: {}
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
                        country: country.name,
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
                result.push({
                    name: country.name,
                    alpha2Code: country.alpha2Code,
                    alpha3Code: country.alpha3Code,
                    region: country.region,
                    subregion: country.subregion
                });
            });

            result.sort(function (o1, o2) {
                return o1.name > o2.name ? 1 : o1.name < o2.name ? -1 : 0;
            });

            return result;
        },
        userLocation: state => {
            const countryInfo = state.userLocation && state.userLocation.country ? state.countries.find(c => c.alpha2Code == state.userLocation.country) : {};
            return {
                ...state.userLocation,
                countryName: countryInfo.name,
                callingCodes: countryInfo.callingCodes || []
            };
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
        },
        getLocationInfo: async (state) => {
            try {
                // TODO: not good idea to set oken here
                const response = await fetch('http://ipinfo.io?token=');
                let data = await response.json();
                console.log('use locati');
                console.log(data);
                state.userLocation = data;
            } catch (error) {
                console.error(error);
            }
        }
    }
};

export default core(service, store);