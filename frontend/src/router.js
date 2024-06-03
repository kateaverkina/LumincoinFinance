import {MainPage} from "./components/main-page.js";
import {Login} from "./components/auth/login.js";
import {Signup} from "./components/auth/signup.js";
import {Logout} from "./components/auth/logout.js";
import {OperationsView} from "./components/operations/operations-view.js";
import {OperationsCreate} from "./components/operations/operations-create.js";
import {OperationsUpdate} from "./components/operations/operations-update.js";
import {OperationsDelete} from "./components/operations/operations-delete.js";
import {IncomeView} from "./components/categories/income/income-view.js";
import {IncomeCreate} from "./components/categories/income/income-create.js";
import {IncomeUpdate} from "./components/categories/income/income-update.js";
import {IncomeDelete} from "./components/categories/income/income-delete.js";
import {ExpenseView} from "./components/categories/expense/expense-view.js";
import {ExpenseCreate} from "./components/categories/expense/expense-create.js";
import {ExpenseUpdate} from "./components/categories/expense/expense-update.js";
import {ExpenseDelete} from "./components/categories/expense/expense-delete.js";
import {FileUtils} from "./utils/file-utils.js";
import {AuthUtils} from "./utils/auth-utils.js";
import {CommonUtils} from "./utils/common-utils";


export class Router {
    constructor() {
        this.titlePageElement = document.getElementById('title');
        this.contentPageElement = document.getElementById('content');
        this.adminLteStyleElement = document.getElementById('adminlte_style');
        this.adminLteScriptElement = document.getElementById('adminlte_script');

        this.initEvents();
        this.routes = [
            {
                route: '/',
                title: 'Главная',
                filePathTemplate: '/templates/pages/main-page.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new MainPage();
                },
                styles: [
                    'tempusdominus-bootstrap-4.min.css'
                ],
                scripts: [
                    'moment.min.js',
                    'moment-ru-locale.js',
                    'tempusdominus-bootstrap-4.min.js'
                ],
                //     scripts: ['Chart.min.js'],
                //     styles: ['Chart.min.css']
            },
            {
                route: '/404',
                title: 'Page not found',
                filePathTemplate: '/templates/pages/404.html',
                useLayout: false,
            },
            {
                route: '/login',
                title: 'Авторизация',
                filePathTemplate: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('login-page');
                    document.body.style.height = 'auto';
                },
            },
            {
                route: '/signup',
                title: 'Регистрация',
                filePathTemplate: '/templates/pages/auth/signup.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    new Signup(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                filePathTemplate: '/templates/pages/operations/operations-view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsView();
                },
                styles: [
                    'dataTables.bootstrap4.min.css',
                    'responsive.bootstrap4.min.css',
                    'tempusdominus-bootstrap-4.min.css'
                ],
                scripts: [
                    'jquery.dataTables.min.js',
                    'dataTables.responsive.min.js',
                    'responsive.bootstrap4.min.js',
                    'moment.min.js',
                    'moment-ru-locale.js',
                    'tempusdominus-bootstrap-4.min.js'
                ],
            },
            {
                route: '/operations/create',
                title: 'Создать доход/расход',
                filePathTemplate: '/templates/pages/operations/operations-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsCreate();
                },
                styles: [
                    'select2.min.css',
                    'select2-bootstrap4.min.css',
                    'tempusdominus-bootstrap-4.min.css'
                ],
                scripts: [
                    'select2.full.min.js',
                    'moment.min.js',
                    'moment-ru-locale.js',
                    'tempusdominus-bootstrap-4.min.js'
                ],
            },
            {
                route: '/operations/update',
                title: 'Редактировать доход/расход',
                filePathTemplate: '/templates/pages/operations/operations-update.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsUpdate();
                },
                styles: [
                    'select2.min.css',
                    'select2-bootstrap4.min.css',
                    'tempusdominus-bootstrap-4.min.css'
                ],
                scripts: [
                    'select2.full.min.js',
                    'moment.min.js',
                    'moment-ru-locale.js',
                    'tempusdominus-bootstrap-4.min.js'
                ],
            },
            {
                route: '/operations/delete',
                load: () => {
                    new OperationsDelete();
                },
            },
            {
                route: '/income',
                title: 'Доходы',
                filePathTemplate: '/templates/pages/categories/income/income-view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeView(this.openNewRoute.bind(this));
                },
            },
            {
                route: '/income/create',
                title: 'Создать доход',
                filePathTemplate: '/templates/pages/categories/income/income-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate();
                },
            },
            {
                route: '/income/update',
                title: 'Редактировать доход',
                filePathTemplate: '/templates/pages/categories/income/income-update.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeUpdate();
                },
            },
            {
                route: '/income/delete',
                load: () => {
                    new IncomeDelete();
                },
            },
            {
                route: '/expense',
                title: 'Расходы',
                filePathTemplate: '/templates/pages/categories/expense/expense-view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseView();
                },
            },
            {
                route: '/expense/create',
                title: 'Создать расход',
                filePathTemplate: '/templates/pages/categories/expense/expense-create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCreate();
                },
            },
            {
                route: '/expense/update',
                title: 'Редактировать расход',
                filePathTemplate: '/templates/pages/categories/expense/expense-update.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseUpdate();
                },
            },
            {
                route: '/expense/delete',
                load: () => {
                    new ExpenseDelete();
                },
            },
        ]
    }


    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }
        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }
            await this.openNewRoute(url);
        }
    }

    async activateRoute(e, oldRoute = null) {

        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);
            if (currentRoute.styles && currentRoute.styles.length > 0) {
                currentRoute.styles.forEach(style => {
                    document.querySelector(`link[href='/css/${style}']`).remove();
                });
            }
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(script => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                });
            }

            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === urlRoute);

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach(style => {
                    FileUtils.loadPageStyle('/css/' + style, this.adminLteStyleElement);
                });
            }
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script, this.adminLteScriptElement);
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }


            if (newRoute.filePathTemplate) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById('content-layout');
                    document.body.classList.add('sidebar-mini');
                    document.body.classList.add('sidebar-open');
                    document.body.classList.add('layout-fixed');

                    this.profileElement = document.getElementById('profile-name');
                    if (!this.userName) {
                        let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoKey);
                        if(!userInfo) {
                            return this.openNewRoute('/login');
                        }
                        if (userInfo) {
                            userInfo = JSON.parse(userInfo);
                        }
                        if (userInfo.name && userInfo.lastName) {
                            this.userName = userInfo.name;
                            this.userLastName = userInfo.lastName;
                        }
                    }
                    this.profileElement.innerText = this.userName + ' ' + this.userLastName;
                    CommonUtils.getBalance().then();
                    CommonUtils.updateBalance().then();
                    this.activateMenuItem(newRoute);
                } else {
                    document.body.classList.remove('sidebar-mini');
                    document.body.classList.remove('sidebar-open');
                    document.body.classList.remove('layout-fixed');
                }
                contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(response => response.text());
            }


            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
            history.pushState({}, '', '/404');
            await this.activateRoute;
        }
    }

    activateMenuItem(route) {
        document.querySelectorAll('.nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
                document.body.classList.remove('sidebar-open');
            } else {
                item.classList.remove('active');
            }
        });

        const categoriesElement = document.getElementById('categories');
        const arrowElement = document.getElementById('arrow');
        const cardBodyElement = document.getElementById('card-body');
        const incomeElement = document.getElementById('income');
        const expenseElement = document.getElementById('expense');

        categoriesElement.addEventListener('click', () => {
            this.showCategories(categoriesElement);

            if (arrowElement.classList.contains('fa-chevron-right')) {
                this.showCategories(null, arrowElement, cardBodyElement);
            } else {
                arrowElement.classList.remove('fa-chevron-down');
                arrowElement.classList.add('fa-chevron-right');
                cardBodyElement.style.display = 'none';
            }
        });

        document.querySelectorAll('.income-expense-link').forEach(item => {
            const href = item.getAttribute('href');
            if (route.route === '/income' && href === '/income' || route.route === '/income/create' || route.route === '/income/update') {
                this.showCategories(categoriesElement, arrowElement, cardBodyElement);
                incomeElement.classList.add('bg-primary');
                expenseElement.classList.remove('bg-primary');
                document.body.classList.remove('sidebar-open');
            } else if (route.route === '/expense' && href === '/expense' || route.route === '/expense/create' || route.route === '/expense/update') {
                this.showCategories(categoriesElement, arrowElement, cardBodyElement);
                expenseElement.classList.add('bg-primary');
                incomeElement.classList.remove('bg-primary');
                document.body.classList.remove('sidebar-open');
            }
        });

        document.getElementById('user-icon').addEventListener('click', () => {
            document.getElementById('logout').style.display = 'block';
        })
    }

    showCategories(categories, arrow, card) {
        if (categories) {
            categories.classList.add('card-primary');
            categories.classList.add('open-card');
        }

        if (arrow) {
            arrow.classList.remove('fa-chevron-right');
            arrow.classList.add('fa-chevron-down');
        }

        if (card) {
            card.style.display = 'block';
        }
    }
}