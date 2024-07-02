import {CategoriesService} from "../../../service/categories-service.js";
import {UrlUtils} from "../../../utils/url-utils.js";
import {ValidationUtils} from "../../../utils/validation-utils.js";

export class IncomeUpdate {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }

        this.param = 'income';
        this.categoryElement = document.getElementById('update-input');

        this.validations = [
            {element: this.categoryElement}
        ]

        document.getElementById('update-button').addEventListener('click', this.updateCategory.bind(this));

        this.init(id).then();
    }

    async init(id) {
        const categoryData = await this.getCategory(id);
        if (categoryData) {
            this.showCategory(categoryData);
        }
    }


    async getCategory(id) {
        const response = await CategoriesService.getCategory(this.param, id);
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        this.categoryOriginalData = response.category;
        return response.category;
    }

    showCategory(category) {
        document.getElementById('update-input').value = category.title;
    }

    async updateCategory(e) {
        e.preventDefault();
        if (ValidationUtils.validateForm(this.validations)) {
            const categoryChangedData = {
                title: this.categoryElement.value,
            };

            if(categoryChangedData.title !== this.categoryOriginalData.title) {
                const response = await CategoriesService.updateCategory(this.param, this.categoryOriginalData.id, categoryChangedData);

                if (response.error) {
                    alert(response.error);
                    return response.redirect ? this.openNewRoute(response.redirect) : null;
                }

                return this.openNewRoute('/' + this.param);
            }
            return this.openNewRoute('/' + this.param);
        }
    }
}