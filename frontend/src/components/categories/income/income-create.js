import {CategoriesService} from "../../../service/categories-service.js";
import {ValidationUtils} from "../../../utils/validation-utils.js";

export class IncomeCreate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.param = 'income';
        this.categoryElement = document.getElementById('create-input');

        this.validations = [
            {element: this.categoryElement},
        ];

        document.getElementById('create-button').addEventListener('click', this.createCategory.bind(this));
    }

    async createCategory() {
        if(ValidationUtils.validateForm(this.validations)) {
            const createData = {
                title: this.categoryElement.value,
            };

            const response = await CategoriesService.createCategory(this.param, createData);

            if(response.error) {
                alert(response.error);
                return response.redirect ? this.openNewRoute(response.redirect) : null;
            }

            return this.openNewRoute('/' + this.param);
        }
    }
}