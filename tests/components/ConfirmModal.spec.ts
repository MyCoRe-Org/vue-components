import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import ConfirmModal from '@/components/modal/ConfirmModal.vue';
import { useConfirmModal } from '@/composables/use-confirm-modal';
import { findModal, isModalShown } from '../helpers';

let wrapper: VueWrapper | undefined;

const mountConfirmModal = () => {
  wrapper = mount(ConfirmModal, { attachTo: document.body });
  return wrapper;
};

const footerButtons = () =>
  Array.from(
    findModal('confirmModal')!.querySelectorAll<HTMLButtonElement>(
      '.modal-footer button'
    )
  );

const waitUntilShown = () =>
  vi.waitFor(() => expect(isModalShown('confirmModal')).toBe(true));

afterEach(() => {
  wrapper?.unmount();
  wrapper = undefined;
  const { state } = useConfirmModal();
  state.cancel();
  document.body.innerHTML = '';
  document.body.className = '';
  document.body.removeAttribute('style');
});

describe('ConfirmModal', () => {
  it('shows title and message of a confirm call', async () => {
    mountConfirmModal();
    void useConfirmModal().confirm('Delete?', 'Really delete it?');
    await waitUntilShown();
    const modal = findModal('confirmModal')!;
    expect(modal.querySelector('.modal-title')?.textContent).toBe('Delete?');
    expect(modal.querySelector('.modal-body')?.textContent?.trim()).toBe(
      'Really delete it?'
    );
  });

  it('resolves true on ok', async () => {
    mountConfirmModal();
    const result = useConfirmModal().confirm('Title', 'Message');
    await waitUntilShown();
    footerButtons()[1].click();
    await expect(result).resolves.toBe(true);
  });

  it('resolves false on cancel', async () => {
    mountConfirmModal();
    const result = useConfirmModal().confirm('Title', 'Message');
    await waitUntilShown();
    footerButtons()[0].click();
    await expect(result).resolves.toBe(false);
  });

  it('resolves false on the close button', async () => {
    mountConfirmModal();
    const result = useConfirmModal().confirm('Title', 'Message');
    await waitUntilShown();
    findModal('confirmModal')!
      .querySelector<HTMLButtonElement>('.btn-close')!
      .click();
    await expect(result).resolves.toBe(false);
  });

  it('resolves false on escape', async () => {
    mountConfirmModal();
    const result = useConfirmModal().confirm('Title', 'Message');
    await waitUntilShown();
    findModal('confirmModal')!.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    );
    await expect(result).resolves.toBe(false);
  });

  it('shows a confirm started right after the previous one', async () => {
    mountConfirmModal();
    const { confirm } = useConfirmModal();
    const first = confirm('First', 'Message');
    await waitUntilShown();
    footerButtons()[1].click();
    await expect(first).resolves.toBe(true);
    const second = confirm('Second', 'Message');
    await vi.waitFor(() => {
      expect(isModalShown('confirmModal')).toBe(true);
      expect(
        findModal('confirmModal')!.querySelector('.modal-title')?.textContent
      ).toBe('Second');
      expect(document.body.classList).toContain('modal-open');
    });
    footerButtons()[0].click();
    await expect(second).resolves.toBe(false);
  });

  it('passes the options to the buttons', async () => {
    mountConfirmModal();
    void useConfirmModal().confirm('Title', 'Message', {
      okOnly: true,
      okTitle: 'Got it',
      okVariant: 'success',
    });
    await waitUntilShown();
    const buttons = footerButtons();
    expect(buttons).toHaveLength(1);
    expect(buttons[0].textContent?.trim()).toBe('Got it');
    expect(buttons[0].classList).toContain('btn-success');
  });
});
