import {HttpUtils} from "../utils/http-utils.js";

export class CategoriesService {
    static async getCategories(param) {
        const returnObject = {
            error: false,
            redirect: null,
            categories: null
        };

        const result = await HttpUtils.request('/categories/' + param);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе категорий. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.categories = result.response;
        return returnObject;
    }

    static async getCategory(param, id) {
        const returnObject = {
            error: false,
            redirect: null,
            category: null
        };

        const result = await HttpUtils.request('/categories/' + param + '/' + id);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при запросе категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.category = result.response;
        return returnObject;
    }

    static showCategoriesList(categories, param) {
        const incomeCategoriesElement = document.getElementById('categories-list');
        let popup = document.getElementById('popup');

        for (let i = 0; i < categories.length; i++) {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'col-lg-4';

            const incomeCard = document.createElement('div');
            incomeCard.className = 'income-card card p-4';

            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'category-title';
            categoryTitle.innerText = categories[i].title;

            const categoryButtons = document.createElement('div');
            categoryButtons.className = 'row  ml-0';

            const updateButton = document.createElement('a');
            updateButton.className = 'btn btn-primary btn-sm mr-2 mb-1 update';
            updateButton.innerText = 'Редактировать';
            updateButton.onclick = function (e) {
                updateButton.href = param + '/update?id=' + categories[i].id;
            }

            const deleteButton = document.createElement('a');
            deleteButton.className = 'btn btn-danger btn-sm mb-1 delete';
            deleteButton.innerText = 'Удалить';
            deleteButton.onclick = () => {
                popup.classList.add('open');
                document.getElementById('delete-category').href = param + '/delete?id=' + categories[i].id +
                    '&title=' + categories[i].title;
                document.getElementById('do-not-delete').addEventListener('click', () => {
                    popup.classList.remove('open');
                })
            }

            categoryButtons.appendChild(updateButton);
            categoryButtons.appendChild(deleteButton);
            incomeCard.appendChild(categoryTitle);
            incomeCard.appendChild(categoryButtons);
            categoryElement.appendChild(incomeCard);
            incomeCategoriesElement.prepend(categoryElement);
        }
    }

    static
    async createCategory(param, data) {
        const returnObject = {
            error: false,
            redirect: null,
            id: null
        };

        const result = await HttpUtils.request('/categories/' + param, "POST", true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при создании категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }

    static async updateCategory(param, id, data) {
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request('/categories/' + param + '/' + id, "PUT", true, data);

        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при редактировании категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        returnObject.id = result.response.id;
        return returnObject;
    }


    static async deleteCategory(param, id) {
        const returnObject = {
            error: false,
            redirect: null,
        };

        const result = await HttpUtils.request('/categories/'  + param + '/' + id, 'DELETE', true);
        if (result.redirect || result.error || !result.response || (result.response && result.response.error)) {
            returnObject.error = 'Возникла ошибка при удалении категории. Обратитесь в поддержку';
            if (result.redirect) {
                returnObject.redirect = result.redirect;
            }
            return returnObject;
        }

        return returnObject;
    }
}