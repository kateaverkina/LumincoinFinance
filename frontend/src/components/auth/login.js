import {AuthUtils} from "../../utils/auth-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class Login {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.passwordElement},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
        ];

        document.getElementById('process-button').addEventListener('click', this.login.bind(this));
    }

    findElements() {
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.rememberMeElement = document.getElementById('remember-me');
        this.commonErrorElement = document.getElementById('common-error');
    }

    async login() {
        this.commonErrorElement.style.display = 'none';

        if (ValidationUtils.validateForm(this.validations)) {
            const result = await HttpUtils.request('/login', 'POST', false, {
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: this.rememberMeElement.checked,
                });

            if (result.error || !result.response || (result.response && !result.response.tokens.accessToken || !result.response.tokens.refreshToken ||
                !result.response.user.id || !result.response.user.name || !result.response.user.lastName)) {
                return false;
            }

            if (result.response) {
                AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken,
                    {
                        id: result.response.user.id,
                        name: result.response.user.name,
                        lastName: result.response.user.lastName
                    });
                return this.openNewRoute('/');
            }

            this.commonErrorElement.style.display = 'block';
        }
    }
}