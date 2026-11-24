import { ConfirmModalOptions } from '@/components/modal/types';
import { reactive, watch } from 'vue';

interface State {
  isOpen: boolean;
  title: string;
  message: string;
  options?: ConfirmModalOptions;
  cancel: () => void;
  confirm: (value: unknown) => void;
}

let settle: ((confirmed: boolean) => void) | undefined;

const finish = (confirmed: boolean): void => {
  const resolve = settle;
  settle = undefined;
  state.isOpen = false;
  resolve?.(confirmed);
};

const state = reactive<State>({
  isOpen: false,
  title: '',
  message: '',
  cancel: () => finish(false),
  confirm: () => finish(true),
});

watch(
  () => state.isOpen,
  isOpen => {
    if (!isOpen) {
      finish(false);
    }
  },
  { flush: 'sync' }
);

export function useConfirmModal() {
  const confirm = (
    title: string,
    message: string,
    options?: ConfirmModalOptions
  ): Promise<boolean> => {
    const previous = settle;
    settle = undefined;
    previous?.(false);
    state.title = title;
    state.message = message;
    state.options = options;
    state.isOpen = true;
    return new Promise<boolean>(resolve => {
      settle = resolve;
    });
  };

  return {
    state,
    confirm,
  };
}
