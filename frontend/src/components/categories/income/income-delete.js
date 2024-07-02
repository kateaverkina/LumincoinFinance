import {UrlUtils} from "../../../utils/url-utils.js";
import {CategoriesService} from "../../../service/categories-service.js";
import {OperationsService} from "../../../service/operations-service.js";

export class IncomeDelete {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const id = UrlUtils.getUrlParam('id');
        if (!id) {
            return this.openNewRoute('/');
        }
        const title = UrlUtils.getUrlParam('title');

        this.param = 'income';

        this.deleteCategory(id, title).then();
    }

    async getOperations() {
        const response = await OperationsService.getAllOperations();
        if (response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }
        return response.operations;
    }

    async deleteCategory(id, title) {
        const operationsData = await this.getOperations();

        if (operationsData) {
            const operationsToDelete = operationsData.filter(operationData => {
                return operationData.category === title;
            })

            operationsToDelete.forEach(item => {
                OperationsService.deleteOperation(item.id);
            })
        }
        const response = await CategoriesService.deleteCategory(this.param, id);

        if(response.error) {
            alert(response.error);
            return response.redirect ? this.openNewRoute(response.redirect) : null;
        }

        return this.openNewRoute('/' + this.param);
    }
}