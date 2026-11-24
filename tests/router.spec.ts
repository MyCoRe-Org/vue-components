import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { errorRoutes } from '@/router';
import { I18N_PREFIX } from '@/common/i18n-utils';
import { createTestI18n } from './helpers';

const i18n = createTestI18n(
  Object.fromEntries(
    ['401', '403', '404', 'general'].flatMap(code => [
      [`${I18N_PREFIX}error.${code}.message`, `message ${code}`],
      [`${I18N_PREFIX}error.${code}.description`, `description ${code}`],
    ])
  )
);

describe('errorRoutes', () => {
  it('defines the error routes', () => {
    expect(errorRoutes.map(({ path, name }) => ({ path, name }))).toEqual([
      { path: '/401', name: '401' },
      { path: '/403', name: '403' },
      { path: '/404', name: '404' },
      { path: '/error', name: 'error' },
    ]);
  });

  it.each([
    ['401', '401'],
    ['403', '403'],
    ['404', '404'],
    ['error', 'general'],
  ])('renders the texts of %s', (name, code) => {
    const route = errorRoutes.find(r => r.name === name)!;
    const wrapper = mount(route.component, { global: { plugins: [i18n] } });
    expect(wrapper.get('h1').text()).toBe(`message ${code}`);
    expect(wrapper.get('p').text()).toBe(`description ${code}`);
  });
});
