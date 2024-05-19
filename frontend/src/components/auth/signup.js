export class Signup {
    constructor() {
        this.findElements();

        document.getElementById('process-button').addEventListener('click', this.signup.bind(this));
    }

    findElements() {
        this.fullNameElement = document.getElementById('full-name');
        this.emailElement = document.getElementById('email');
        this.passwordElement = document.getElementById('password');
        this.repeatPasswordElement = document.getElementById('repeat-password');
    }

    validateForm() {
        if (this.fullNameElement.value && this.fullNameElement.value.match(/^[А-ЯЁ][а-яё]* [А-ЯЁ][а-яё]* [А-ЯЁ][а-яё]*$/)) {
            this.fullNameElement.classList.remove('is-invalid');
        } else {
            this.fullNameElement.classList.add('is-invalid');
        }
        if (this.emailElement.value && this.emailElement.value.match(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)) {
            this.emailElement.classList.remove('is-invalid');
        } else {
            this.emailElement.classList.add('is-invalid');
        }
        if (this.passwordElement.value && this.passwordElement.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.passwordElement.classList.remove('is-invalid');
        } else {
            this.passwordElement.classList.add('is-invalid');
        }
        if (this.repeatPasswordElement.value && this.repeatPasswordElement.value === this.passwordElement.value) {
            this.repeatPasswordElement.classList.remove('is-invalid');
        } else {
            this.repeatPasswordElement.classList.add('is-invalid');
        }
    }

    signup() {
        this.validateForm();
    }
}