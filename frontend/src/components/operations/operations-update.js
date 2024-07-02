import {UrlUtils} from "../../utils/url-utils.js";
import {CategoriesService} from "../../service/categories-service.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {OperationsService} from "../../service/operations-service.js";
import {CommonUtils} from "../../utils/common-utils.js";

export class OperationsUpdate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        $('#date').datetimepicker({
            format: 'L'
        });

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.findElements();

        document.getElementById('update-button').addEventListener('click', this.updateOperation.bind(this));

        this.validations = [
            {element: this.typeElement},
            {element: this.categoryElement},
            {element: this.amountElement},
            {element: this.dateElement, date: this.dateErrorElement},
            {element: this.commentElement},
        ];

        this.init(id).then();
    }

    findElements() {
        this.typeElement = document.getElementById('type');
        this.categoryElement = document.getElementById('category');
        this.amountElement = document.getElementById('amount');
        this.dateElement = document.getElementById('date');
        this.dateErrorElement = document.getElementById('date-error');
        this.commentElement = document.getElementById('comment');
    }

    async init(id) {
        const operationData = await this.getOperation(id);
        if (operationData) {
            this.showOperation(operationData);
            if (operationData.type) {
                await this.getCategories(operationData.category);
            }
        }
    }

    async getOperation(id) {
        const response = await OperationsService.getOperation(id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.operationOriginalData = response.operation;
        return response.operation;
    }

    async getCategories(category) {
        this.categoryElement.innerText = '';
        if (this.typeElement.value === 'Доход') {
            this.response = await CategoriesService.getCategories('income');
        } else if (this.typeElement.value === 'Расход') {
            this.response = await CategoriesService.getCategories('expense');
        }
        if (this.response.error) {
            alert(this.response.error);
            return this.response.redirect ? this.openNewRoute(this.response.redirect) : null;
        }

        this.typeElement.onchange = async () => {
            this.categoryElement.innerText = '';
            if (this.typeElement.value === 'Доход') {
                this.response = await CategoriesService.getCategories('income');
            } else if (this.typeElement.value === 'Расход') {
                this.response = await CategoriesService.getCategories('expense');
            }
            if (this.response.error) {
                alert(this.response.error);
                return this.response.redirect ? this.openNewRoute(this.response.redirect) : null;
            }

            for (let i = 0; i < this.response.categories.length; i++) {
                const option = document.createElement('option');
                option.value = this.response.categories[i].id;
                option.innerText = this.response.categories[i].title;
                this.categoryElement.appendChild(option);
            }
        }

        for (let i = 0; i < this.response.categories.length; i++) {
            const option = document.createElement('option');
            option.value = this.response.categories[i].id;
            option.innerText = this.response.categories[i].title;
            if (category === this.response.categories[i].title) {
                option.selected = true;
            }
            this.categoryElement.appendChild(option);
        }

        $(this.categoryElement).select2({
            theme: 'bootstrap4'
        });
    }

    showOperation(operation) {
        let type = operation.type;
        switch (type) {
            case 'income':
                type = 'Доход';
                break;
            case 'expense':
                type = 'Расход';
                break;
        }
        for (let i = 0; i < this.typeElement.options.length; i++) {
            if (this.typeElement.options[i].value === type) {
                this.typeElement.selectedIndex = i;
            }
        }
        $(this.typeElement).select2({
            theme: 'bootstrap4'
        });

        this.amountElement.value = operation.amount;

        let dateParts = operation.date.split('-');
        let date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        let day = (`0${date.getDate()}`).slice(-2);
        let month = (`0${date.getMonth() + 1}`).slice(-2);
        let year = date.getFullYear();
        this.dateElement.value = day + "." + month + "." + year;

        this.commentElement.value = operation.comment;

        $('#date').datetimepicker({
            format: 'L'
        });
    }

    async updateOperation(e) {
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {
            let type = CommonUtils.switchType(this.typeElement);
            let dateParts = this.dateElement.value.split('.');
            let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
            let day = (`0${date.getDate()}`).slice(-2);
            let month = (`0${date.getMonth() + 1}`).slice(-2);
            let year = date.getFullYear();
            let sendDate = year + "-" + month + "-" + day;

            const operationData = {
                type: type,
                category_id: +this.categoryElement.value,
                amount: parseInt(this.amountElement.value),
                date: sendDate,
                comment: this.commentElement.value,
            };

            const response = await OperationsService.updateOperation(this.operationOriginalData.id, operationData);

            if (response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/operations');
        }
    }
}