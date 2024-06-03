import {HttpUtils} from "./http-utils.js";
import {ValidationUtils} from "./validation-utils.js";

export class CommonUtils {
    static switchButton() {
        const parent = document.querySelector('.main-actions');
        const mainAction = document.querySelectorAll('.main-action');
        const interval = document.getElementById('interval');
        const dateFrom = document.getElementById('date-from');
        const dateTo = document.getElementById('date-to');

        parent.addEventListener('click', (event) => {
            let target = event.target;

            if (target.classList.contains('main-action')) {
                for (let i = 0; i < mainAction.length; i++) {
                    mainAction[i].classList.remove('active');
                }
                target.classList.add('active');
                interval.classList.remove('active');
                dateFrom.value = '';
                dateTo.value = '';
                dateFrom.setAttribute('disabled', 'disabled');
                dateTo.setAttribute('disabled', 'disabled');
            }

            interval.addEventListener('click', () => {
                mainAction.forEach(action => {
                    action.classList.remove('active');
                })
                interval.classList.add('active');
                dateFrom.removeAttribute('disabled');
                dateTo.removeAttribute('disabled');
            })
        });
    }

    static async getBalance() {
        this.balance =  document.getElementById('balance');
        this.newBalance =  document.getElementById('new-balance');
        const result = await HttpUtils.request('/balance');

        if (result.error || !result.response || (result.response && result.response.error) || !result.response.balance) {
            return alert('Возникла ошибка при получении баланса');
        }

        if (result.response) {
            this.balance.innerText = result.response.balance + '$';
        }
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
                    return alert('Возникла ошибка при обновлении баланса');
                }
                return this.balance.innerText = result.response.balance + '$';
            }
        })
    }


}