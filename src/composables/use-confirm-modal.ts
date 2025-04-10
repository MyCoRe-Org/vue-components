import { ConfirmModalOptions } from '@/components/modal/types';
import { reactive } from 'vue';

interface State {
  isOpen: boolean;
  title: string;
  message: string;
  options?: ConfirmModalOptions;
  cancel: () => void;
  confirm: (value: unknown) => void;
}

const state = reactive<State>({
  isOpen: false,
  title: '',
  message: '',
  cancel: () => ({}),
  confirm: () => ({}),
});

export function useConfirmModal() {
  const confirm = (
    title: string,
    message: string,
    options?: ConfirmModalOptions
  ): Promise<boolean> => {
    const confirmPromise = new Promise((resolve, reject) => {
      state.title = title;
      state.message = message;
      state.options = options;
      state.isOpen = true;
      state.confirm = resolve;
      state.cancel = reject;
    });

    return confirmPromise.then(
      () => {
        state.isOpen = false;
        return true;
      },
      () => {
        state.isOpen = false;
        return false;
      }
    );
  };

  return {
    state,
    confirm,
  };
}
