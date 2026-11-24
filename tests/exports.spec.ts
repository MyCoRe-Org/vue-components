import { describe, expect, it } from 'vitest';
import * as components from '@/index';
import { errorRoutes } from '@/router';

describe('package exports', () => {
  it('exports components, composables, routes and views', () => {
    expect(Object.keys(components).sort()).toEqual([
      'BaseError',
      'BaseModal',
      'ConfirmModal',
      'GeneralErrorView',
      'I18N_PREFIX',
      'NotFoundErrorView',
      'PermissionErrorView',
      'SimplePagination',
      'UnauthorizedErrorView',
      'errorRoutes',
      'useConfirmModal',
    ]);
  });

  it('uses the exported views in the error routes', () => {
    const byName = Object.fromEntries(
      errorRoutes.map(route => [route.name, route.component])
    );
    expect(byName).toEqual({
      '401': components.UnauthorizedErrorView,
      '403': components.PermissionErrorView,
      '404': components.NotFoundErrorView,
      error: components.GeneralErrorView,
    });
  });
});
