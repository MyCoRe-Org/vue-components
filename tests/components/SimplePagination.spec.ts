import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SimplePagination from '@/components/pagination/SimplePagination.vue';

const mountPagination = (props: Record<string, unknown>) =>
  mount(SimplePagination, {
    props: { modelValue: 1, totalRows: 50, perPage: 10, ...props },
  });

const pageButtons = (wrapper: ReturnType<typeof mountPagination>) =>
  wrapper.findAll('button').slice(1, -1);

const previousButton = (wrapper: ReturnType<typeof mountPagination>) =>
  wrapper.findAll('button')[0];

const nextButton = (wrapper: ReturnType<typeof mountPagination>) =>
  wrapper.findAll('button').at(-1)!;

describe('SimplePagination', () => {
  it('renders one button per page', () => {
    const wrapper = mountPagination({ totalRows: 41 });
    expect(pageButtons(wrapper).map(b => b.text())).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
    ]);
  });

  it('uses 20 rows per page by default', () => {
    const wrapper = mount(SimplePagination, {
      props: { modelValue: 1, totalRows: 41 },
    });
    expect(pageButtons(wrapper)).toHaveLength(3);
  });

  it('renders a single page without rows', () => {
    const wrapper = mountPagination({ totalRows: 0 });
    expect(pageButtons(wrapper).map(b => b.text())).toEqual(['1']);
    expect(nextButton(wrapper).attributes('disabled')).toBeDefined();
  });

  it('marks and disables the current page', () => {
    const wrapper = mountPagination({ modelValue: 3 });
    const current = pageButtons(wrapper)[2];
    expect(current.attributes('disabled')).toBeDefined();
    expect(current.element.parentElement?.classList).toContain('active');
    expect(pageButtons(wrapper)[1].attributes('disabled')).toBeUndefined();
  });

  it('disables previous on the first page', () => {
    const wrapper = mountPagination({ modelValue: 1 });
    expect(previousButton(wrapper).attributes('disabled')).toBeDefined();
    expect(nextButton(wrapper).attributes('disabled')).toBeUndefined();
  });

  it('disables next on the last page', () => {
    const wrapper = mountPagination({ modelValue: 5 });
    expect(nextButton(wrapper).attributes('disabled')).toBeDefined();
    expect(previousButton(wrapper).attributes('disabled')).toBeUndefined();
  });

  it('emits change-page for a clicked page', async () => {
    const wrapper = mountPagination({ modelValue: 1 });
    await pageButtons(wrapper)[3].trigger('click');
    expect(wrapper.emitted('change-page')).toEqual([[4]]);
  });

  it('emits change-page for previous and next', async () => {
    const wrapper = mountPagination({ modelValue: 3 });
    await previousButton(wrapper).trigger('click');
    await nextButton(wrapper).trigger('click');
    expect(wrapper.emitted('change-page')).toEqual([[2], [4]]);
  });

  it('does not update the model itself', async () => {
    const wrapper = mountPagination({ modelValue: 1 });
    await pageButtons(wrapper)[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('uses custom texts for previous and next', () => {
    const wrapper = mountPagination({ prevText: 'Back', nextText: 'Forward' });
    expect(previousButton(wrapper).text()).toBe('Back');
    expect(nextButton(wrapper).text()).toBe('Forward');
  });
});
