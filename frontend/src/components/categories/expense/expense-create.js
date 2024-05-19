export class ExpenseCreate {
    constructor() {
        this.createInputElement = document.getElementById('create-input');
        document.getElementById('create-button').addEventListener('click', this.create.bind(this));
    }

    validateForm() {
        if (this.createInputElement.value) {
            this.createInputElement.classList.remove('is-invalid');
        } else {
            this.createInputElement.classList.add('is-invalid');
        }
    }

    create() {
        this.validateForm();
    }
}