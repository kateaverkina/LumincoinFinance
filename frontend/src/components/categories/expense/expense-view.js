export class ExpenseView {
    constructor() {
        this.popup = document.getElementById('expense-popup');
        this.deleteExpense();
        this.changeExpenseTitle();

    }

    deleteExpense() {
        document.querySelectorAll('.delete').forEach(item => {
            item.addEventListener('click', () => {
                this.popup.classList.add('open');
            })
        })

        document.getElementById('expense-do-not-delete').addEventListener('click', () => {
            this.popup.classList.remove('open');
        })
    }

    changeExpenseTitle() {
        document.querySelectorAll('.update').forEach(item => {
            item.onclick = function (e) {
                let categoryTitle = e.target.parentElement.previousElementSibling.innerText;
                localStorage.setItem('inputValue', categoryTitle);
                item.href = 'expense/update';
            }
        })
    }
}