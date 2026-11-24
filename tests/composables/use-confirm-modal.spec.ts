import { describe, expect, it } from 'vitest';
import { useConfirmModal } from '@/composables/use-confirm-modal';

describe('useConfirmModal', () => {
  it('opens the modal with title, message and options', () => {
    const { state, confirm } = useConfirmModal();
    confirm('Title', 'Message', { okOnly: true, okTitle: 'Got it' });
    expect(state.isOpen).toBe(true);
    expect(state.title).toBe('Title');
    expect(state.message).toBe('Message');
    expect(state.options).toEqual({ okOnly: true, okTitle: 'Got it' });
    state.cancel();
  });

  it('resolves true and closes when confirmed', async () => {
    const { state, confirm } = useConfirmModal();
    const result = confirm('Title', 'Message');
    state.confirm(undefined);
    await expect(result).resolves.toBe(true);
    expect(state.isOpen).toBe(false);
  });

  it('resolves false and closes when cancelled', async () => {
    const { state, confirm } = useConfirmModal();
    const result = confirm('Title', 'Message');
    state.cancel();
    await expect(result).resolves.toBe(false);
    expect(state.isOpen).toBe(false);
  });

  it('resolves false when the modal is closed otherwise', async () => {
    const { state, confirm } = useConfirmModal();
    const result = confirm('Title', 'Message');
    state.isOpen = false;
    await expect(result).resolves.toBe(false);
  });

  it('resolves a pending confirm with false when a new one starts', async () => {
    const { state, confirm } = useConfirmModal();
    const first = confirm('First', 'Message');
    const second = confirm('Second', 'Message');
    await expect(first).resolves.toBe(false);
    expect(state.isOpen).toBe(true);
    expect(state.title).toBe('Second');
    state.confirm(undefined);
    await expect(second).resolves.toBe(true);
  });

  it('shares its state between callers', () => {
    expect(useConfirmModal().state).toBe(useConfirmModal().state);
  });
});
