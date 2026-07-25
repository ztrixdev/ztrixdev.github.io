
import HomePage from '../pages/home.f7';
import AboutMePage from '../pages/aboutme.f7';
import LinksPage from '../pages/links.f7';
import ProjectsPage from '../pages/projects.f7';
import NotFoundPage from '../pages/404.f7';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/aboutme/',
    component: AboutMePage
  },
    {
    path: '/links/',
    component: LinksPage
  },
  {
    path: '/projects/',
    component: ProjectsPage
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;