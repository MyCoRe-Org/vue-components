import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import BaseModal from '@/components/modal/BaseModal.vue';
import { findModal, isModalShown } from '../helpers';

const wrappers: VueWrapper[] = [];

const mountModal = (props: Record<string, unknown> = {}) => {
  const wrapper = mount(BaseModal, {
    attachTo: document.body,
    props: {
      id: 'testModal',
      title: 'Test title',
      'onUpdate:visible': (visible: boolean) => wrapper.setProps({ visible }),
      ...props,
    },
    slots: { default: 'Modal body' },
  });
  wrappers.push(wrapper);
  return wrapper;
};

const open = async (wrapper: VueWrapper) => {
  await wrapper.setProps({ visible: true });
  await vi.waitFor(() => expect(wrapper.emitted('shown')).toBeTruthy());
};

const footerButtons = () =>
  Array.from(
    findModal('testModal')!.querySelectorAll<HTMLButtonElement>(
      '.modal-footer button'
    )
  );

afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount());
  document.body.innerHTML = '';
  document.body.className = '';
  document.body.removeAttribute('style');
});

describe('BaseModal', () => {
  it('teleports the modal to the body', () => {
    mountModal();
    const modal = findModal('testModal');
    expect(modal?.parentElement).toBe(document.body);
    expect(modal?.querySelector('.modal-title')?.textContent).toBe(
      'Test title'
    );
    expect(modal?.querySelector('.modal-body')?.textContent).toBe('Modal body');
  });

  it('applies size, centered and scrollable classes', () => {
    mountModal({ size: 'lg', centered: true, scrollable: true });
    const dialog = findModal('testModal')!.querySelector('.modal-dialog')!;
    expect(dialog.classList).toContain('modal-lg');
    expect(dialog.classList).toContain('modal-dialog-centered');
    expect(dialog.classList).toContain('modal-dialog-scrollable');
  });

  it('shows and hides the modal with visible', async () => {
    const wrapper = mountModal();
    expect(isModalShown('testModal')).toBe(false);

    await open(wrapper);
    expect(isModalShown('testModal')).toBe(true);
    expect(document.body.classList).toContain('modal-open');
    expect(wrapper.emitted('change')).toEqual([[true]]);

    await wrapper.setProps({ visible: false });
    await vi.waitFor(() => expect(wrapper.emitted('hidden')).toBeTruthy());
    expect(isModalShown('testModal')).toBe(false);
    expect(document.body.classList).not.toContain('modal-open');
  });

  it('renders cancel and ok buttons with titles and variants', () => {
    mountModal({
      cancelTitle: 'Abort',
      cancelVariant: 'danger',
      okTitle: 'Save',
      okVariant: 'success',
    });
    const [cancel, ok] = footerButtons();
    expect(cancel.textContent?.trim()).toBe('Abort');
    expect(cancel.classList).toContain('btn-danger');
    expect(ok.textContent?.trim()).toBe('Save');
    expect(ok.classList).toContain('btn-success');
  });

  it('renders only the ok button with okOnly', () => {
    mountModal({ okOnly: true });
    expect(footerButtons().map(b => b.textContent?.trim())).toEqual(['OK']);
  });

  it('disables the buttons', () => {
    mountModal({ okDisabled: true, cancelDisabled: true });
    expect(footerButtons().every(b => b.disabled)).toBe(true);
  });

  it.each([
    ['cancel', 0],
    ['ok', 1],
  ])('emits %s and hides the modal', async (event, index) => {
    const wrapper = mountModal();
    await open(wrapper);
    footerButtons()[index].click();
    expect(wrapper.emitted(event)).toHaveLength(1);
    await vi.waitFor(() => expect(wrapper.emitted('hidden')).toBeTruthy());
    expect(wrapper.props('visible')).toBe(false);
  });

  it('emits close and hides the modal on the close button', async () => {
    const wrapper = mountModal();
    await open(wrapper);
    findModal('testModal')!
      .querySelector<HTMLButtonElement>('.btn-close')!
      .click();
    expect(wrapper.emitted('close')).toHaveLength(1);
    await vi.waitFor(() => expect(wrapper.emitted('hidden')).toBeTruthy());
  });

  it('stays open when the ok event is prevented', async () => {
    const wrapper = mountModal({
      onOk: (event: Event) => event.preventDefault(),
    });
    await open(wrapper);
    footerButtons()[1].click();
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(wrapper.emitted('hidden')).toBeUndefined();
    expect(isModalShown('testModal')).toBe(true);
  });

  it('stays open when the hide event is prevented', async () => {
    const wrapper = mountModal({
      onHide: (event: Event) => event.preventDefault(),
    });
    await open(wrapper);
    footerButtons()[0].click();
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(wrapper.props('visible')).toBe(true);
  });

  it('replaces the footer with the modal-footer slot', () => {
    const wrapper = mount(BaseModal, {
      attachTo: document.body,
      props: { id: 'testModal', title: 'Title' },
      slots: { 'modal-footer': '<span class="custom">Custom</span>' },
    });
    wrappers.push(wrapper);
    expect(footerButtons()).toHaveLength(0);
    expect(
      findModal('testModal')!.querySelector('.modal-footer .custom')
    ).not.toBeNull();
  });
});
