import {CategoriesService} from "../../../service/categories-service.js";

export class ExpenseView {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.param = 'expense';

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