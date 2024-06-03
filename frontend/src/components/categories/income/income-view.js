import {CommonUtils} from "../../../utils/common-utils";

export class IncomeView {
    constructor() {
        this.deleteIncome();
        this.changeIncomeTitle();
    }

    deleteIncome() {
        this.popup = document.getElementById('income-popup');

        document.querySelectorAll('.delete').forEach(item => {
            item.addEventListener('click', () => {
                this.popup.classList.add('open');
            })
        })
        document.getElementById('income-do-not-delete').addEventListener('click', () => {
            this.popup.classList.remove('open');
        })
    }

    changeIncomeTitle() {
        document.querySelectorAll('.update').forEach(item => {
            item.onclick = function (e) {
                let categoryTitle = e.target.parentElement.previousElementSibling.innerText;
                localStorage.setItem('inputValue', categoryTitle);
                item.href = 'income/update';
            }
        })
    }
}