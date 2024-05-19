export class OperationsUpdate {
    constructor() {
        this.findElements();
        this.chooseType();
        this.chooseDate();

        document.getElementById('update-button').addEventListener('click', this.update.bind(this));
    }

    findElements() {
        this.typeElement = document.getElementById('type');
        this.categoryElement = document.getElementById('category');
        this.sumElement = document.getElementById('sum');
        this.dateElement = document.getElementById('date');
        this.dateErrorElement =  document.getElementById('date-error');
    }

    validateForm() {
        let selectErrorElements =  document.querySelectorAll('.select2-selection--single');

        if (this.typeElement.value) {
            this.typeElement.classList.remove('is-invalid');
            selectErrorElements[0].classList.remove('is-invalid');
            selectErrorElements[0].classList.remove('border-danger');

        } else {
            this.typeElement.classList.add('is-invalid');
            selectErrorElements[0].classList.add('form-control');
            selectErrorElements[0].classList.add('border-danger');
            selectErrorElements[0].classList.add('is-invalid');
        }
        if (this.categoryElement.value) {
            this.categoryElement.classList.remove('is-invalid');
            selectErrorElements[1].classList.remove('is-invalid');
            selectErrorElements[1].classList.remove('border-danger');
        } else {
            this.categoryElement.classList.add('is-invalid');
            selectErrorElements[1].classList.add('form-control');
            selectErrorElements[1].classList.add('border-danger');
            selectErrorElements[1].classList.add('is-invalid');
        }
        if (this.sumElement.value && this.sumElement.value.match(/^\d+$/)) {
            this.sumElement.classList.remove('is-invalid');
        } else {
            this.sumElement.classList.add('is-invalid');
        }
        if (this.dateElement.value) {
            this.dateElement.classList.remove('is-invalid');
            this.dateErrorElement.style.display = 'none';
        } else {
            this.dateElement.classList.add('is-invalid');
            this.dateErrorElement.style.display = 'block';
        }
    }

    update() {
        this.validateForm();
    }

    chooseType() {
        $('.select2').select2();
    }

    chooseDate() {
        $('#date').datetimepicker({
            format: 'L'
        });
    }

}