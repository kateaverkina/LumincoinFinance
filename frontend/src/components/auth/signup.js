import {AuthUtils} from "../../utils/auth-utils.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {HttpUtils} from "../../utils/http-utils.js";

export class Signup {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            return this.openNewRoute('/');
        }

        this.findElements();

        this.validations = [
            {element: this.nameElement},
            {element: this.emailElement, options: {pattern: /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/}},
            {element: this.passwordElement, options: {pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/}},
            {element: this.passwordRepeatElement, options: {compareTo: this.passwordElement.value}},
        ];

        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    }

    findElements() {
        this.nameElement = document.getElementById('name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.passwordRepeatElement = document.getElementById('repeat-password');
        this.commonErrorElement = document.getElementById('common-error');
    }


    async signup() {
        this.commonErrorElement.style.display = 'none';

        for (let i = 0; i < this.validations.length; i++) {
            if (this.validations[i].element === this.passwordRepeatElement) {
                this.validations[i].options.compareTo = this.passwordElement.value;
            }
        }

        if (ValidationUtils.validateForm(this.validations)) {
            let fullName = this.nameElement.value.split(' ');

            const result = await HttpUtils.request('/signup', 'POST', false, {
                name: fullName[0],
                lastName: fullName[1],
                email: this.emailElement.value,
                password: this.passwordElement.value,
                passwordRepeat: this.passwordRepeatElement.value
            });

            if (result.error || !result.response || (result.response && !result.response.user.id || !result.response.user.name
                || !result.response.user.lastName || !result.response.user.email )) {
                return this.commonErrorElement.style.display = 'block';
            }

            if (result.response) {
                const result = await HttpUtils.request('/login', 'POST', false, {
                    email: this.emailElement.value,
                    password: this.passwordElement.value,
                    rememberMe: false,
                });

                AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken,
                    {
                        id: result.response.user.id,
                        name: result.response.user.name,
                        lastName: result.response.user.lastName
                    });
                return this.openNewRoute('/');
            }
        }
    }
}