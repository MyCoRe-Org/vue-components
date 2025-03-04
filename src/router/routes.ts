import PermissionErrorView from '@/views/errors/PermissionErrorView.vue';
import UnauthorizedErrorView from '@/views/errors/UnauthorizedErrorView.vue';
import GeneralErrorView from '@/views/errors/GeneralErrorView.vue';
import NotFoundErrorView from '@/views/errors/NotFoundErrorView.vue';

export const errorRoutes = [
  {
    path: '/401',
    name: '401',
    component: PermissionErrorView,
  },
  {
    path: '/403',
    name: '403',
    component: UnauthorizedErrorView,
  },
  {
    path: '/404',
    name: '404',
    component: NotFoundErrorView,
  },
  {
    path: '/error',
    name: 'error',
    component: GeneralErrorView,
  },
];
