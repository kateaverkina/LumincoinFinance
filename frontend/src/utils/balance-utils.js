import {HttpUtils} from "./http-utils.js";
import {ValidationUtils} from "./validation-utils.js";

export class BalanceUtils {

    static async getBalance() {
        const returnObject = {
            error: false,
            redirect: null,
        };

        this.balance = document.getElementById('balance');
        this.newBalance = document.getElementById('new-balance');
        const result = await HttpUtils.request('/balance');

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при получении баланса. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        if (result.response) {
            this.balance.innerText = result.response.balance + '$';
        }

        returnObject.balance = this.balance;
        return returnObject;
    }

    static async updateBalance() {
        this.validations = [
            {element: this.newBalance},
        ];

        this.popup = document.getElementById('balance-popup');
        this.balance.addEventListener('click', () => {
            this.popup.classList.add('open');
        })

        document.getElementById('balance-cancel').addEventListener('click', () => {
            this.popup.classList.remove('open');
        })

        document.getElementById('update-balance').addEventListener('click', async () => {
            if (ValidationUtils.validateForm(this.validations)) {
                this.popup.classList.remove('open');

                const result = await HttpUtils.request('/balance', 'PUT', true, {
                    newBalance: this.newBalance.value,
                });

                if (result.error || !result.response || (result.response && result.response.error) || !result.response.balance) {
                    return alert('Возникла ошибка при обновлении баланса. Обратитесь в поддержку');
                }
                return this.balance.innerText = result.response.balance + '$';
            }
        })
    }
}