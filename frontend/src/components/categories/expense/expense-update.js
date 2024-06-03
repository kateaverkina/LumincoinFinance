
export class ExpenseUpdate {
    constructor() {
        this.setInputValue();
        this.updateInputElement = document.getElementById('update-input');
        document.getElementById('update-button').addEventListener('click', this.update.bind(this));
    }

    setInputValue() {
        let inputValue = localStorage.getItem('inputValue');
        let inputElement = document.getElementById('update-input');
        inputElement.value = inputValue;
    }

    validateForm() {
        if (this.updateInputElement.value) {
            this.updateInputElement.classList.remove('is-invalid');
        } else {
            this.updateInputElement.classList.add('is-invalid');
        }
    }

    update() {
        this.validateForm();
    }
}