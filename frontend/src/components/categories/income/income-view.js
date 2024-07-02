import {CategoriesService} from "../../../service/categories-service.js";

export class IncomeView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.param = 'income';
        this.getExpenseCategories().then();
    }

    async getExpenseCategories() {
        const response = await CategoriesService.getCategories(this.param);

        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        CategoriesService.showCategoriesList(response.categories, this.param);
    }
}