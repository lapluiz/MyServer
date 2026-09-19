export default class Router {
    constructor(routes) {
        this.routes = routes;
        this.loadInitialRoute();
    }

    loadInitialRoute() {
        const path = window.location.pathname;
        this.loadRoute(path);

        window.onpopstate = () => {
            this.loadRoute(window.location.pathname);
        }
    }

    loadRoute(path) {
        const matchedRoute = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/404');
        const view = matchedRoute ? matchedRoute.view : null;

        if (view) {
            document.getElementById('app').innerHTML = view();
            if (matchedRoute.afterRender) matchedRoute.afterRender();
        } else {
            console.error('Route not found');
        }
    }

    navigateTo(path) {
        window.history.pushState({}, path, window.location.origin + path);
        this.loadRoute(path);
    }
}
