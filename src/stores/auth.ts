import { defineStore } from 'pinia';

import axios from 'axios';
import router from '../router/router';


export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        user: JSON.parse(localStorage.getItem('user') as string),
        returnUrl: null
    }),
    actions: {
        async login(username: any, password: any) {
            const data = {
                username: username,
                password: password
            }
            const user = await axios.post(`http://localhost:3000/auth/login`, data as any);

            // update pinia state
            this.user = user.data._doc;
            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));

            // redirect to previous url or default to home page
            router.push(this.returnUrl || '/');
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            router.push('/auth/login');
        }
    }
});
