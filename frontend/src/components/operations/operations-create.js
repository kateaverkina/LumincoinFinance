import {CategoriesService} from "../../service/categories-service.js";
import {ValidationUtils} from "../../utils/validation-utils.js";
import {CommonUtils} from "../../utils/common-utils.js";
import {OperationsService} from "../../service/operations-service.js";
import {UrlUtils} from "../../utils/url-utils.js";

export class OperationsCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const type = UrlUtils.getUrlParam('type');
        if (!type) {
            return this.openNewRoute('/');
        }

        $('#date').datetimepicker({
            format: 'DD.MM.YYYY'
        });
        this.findElements();
        this.getType(type);
        this.chooseSelect();
        this.getCategories().then();

        this.validations = [
            {element: this.typeElement},
            {element: this.categoryElement},
            {element: this.sumElement},
            {element: this.dateElement},
            {element:this.commentElement},
        ];

        document.getElementById('create-button').addEventListener('click', this.createOperation.bind(this));
    }

    findElements() {
        this.typeElement = document.getElementById('type');
        this.categoryElement = document.getElementById('choose-category');
        this.sumElement = document.getElementById('sum');
        this.dateElement = document.getElementById('date');
        this.commentElement = document.getElementById('comment');
    }

    getType(type) {
        if(type === 'income') {
           this.typeElement.value = 'Доход';
        }
        if(type === 'expense') {
           this.typeElement.value = 'Расход';
        }
    }

    async getCategories() {
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
    }

    async createOperation() {
       if(ValidationUtils.validateForm(this.validations)) {
           let type = CommonUtils.switchType(this.typeElement);

           let dateParts = this.dateElement.value.split('.');
           let date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
           let day = (`0${date.getDate()}`).slice(-2);
           let month = (`0${date.getMonth() + 1}`).slice(-2);
           let year = date.getFullYear();
           let sendDate = year + "-" + month + "-" + day;

           const createData = {
               type: type,
               amount: this.sumElement.value,
               date: sendDate,
               comment: this.commentElement.value,
               category_id: +this.categoryElement.value
           };

           const response = await OperationsService.createOperation(createData);

           if(response.error) {
               alert(response.error);
               return response.redirect ? this.openNewRoute(response.redirect) : null;
           }

           return this.openNewRoute('/operations');
       }
    }

    chooseSelect() {
        $('.select2').select2();
    }
}