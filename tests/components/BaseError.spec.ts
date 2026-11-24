import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseError from '@/components/error/BaseError.vue';

describe('BaseError', () => {
  it('renders message and description', () => {
    const wrapper = mount(BaseError, {
      props: { message: 'Not found', description: 'The page does not exist.' },
    });
    expect(wrapper.get('h1').text()).toBe('Not found');
    expect(wrapper.get('p').text()).toBe('The page does not exist.');
    expect(wrapper.classes()).toContain('alert-danger');
  });
});
