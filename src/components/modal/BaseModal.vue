<template>
  <Teleport to="body">
    <div
      :id="id"
      ref="modalElement"
      class="modal fade"
      tabindex="-1"
      role="dialog"
    >
      <div class="modal-dialog" :class="dialogClasses">
        <div class="modal-content">
          <div class="modal-header">
            <slot name="modal-header">
              <slot name="modal-title">
                <h5 class="modal-title">{{ title }}</h5>
              </slot>
              <slot name="modal-header-close">
                <button type="button" class="btn-close" @click="handleClose" />
              </slot>
            </slot>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer">
            <slot name="modal-footer">
              <slot name="modal-cancel">
                <button
                  v-if="!okOnly"
                  type="button"
                  :disabled="cancelDisabled"
                  class="btn"
                  :class="`btn-${cancelVariant}`"
                  @click="handleCancel"
                >
                  {{ cancelTitle }}
                </button>
              </slot>
              <slot name="modal-ok">
                <button
                  :disabled="okDisabled"
                  type="button"
                  class="btn"
                  :class="`btn-${okVariant}`"
                  @click="handleOk"
                >
                  {{ okTitle }}
                </button>
              </slot>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ModelRef, ref, onMounted, onUnmounted, watch } from 'vue';
import { BaseModalOptions, BaseModalEmits } from './types';
import { Modal } from 'bootstrap';

const BS_MODAL_SUFFIX = '.bs.modal';
const HIDE_EVENT_TYPE = `hide${BS_MODAL_SUFFIX}`;
const HIDDEN_EVENT_TYPE = `hidden${BS_MODAL_SUFFIX}`;
const SHOW_EVENT_TYPE = `show${BS_MODAL_SUFFIX}`;
const SHOWN_EVENT_TYPE = `shown${BS_MODAL_SUFFIX}`;

const props = withDefaults(defineProps<BaseModalOptions>(), {
  busy: false,
  cancelDisabled: false,
  cancelTitle: 'Cancel',
  cancelVariant: 'secondary',
  centered: false,
  noCloseOnEsc: false,
  okDisabled: false,
  okOnly: false,
  okTitle: 'OK',
  okVariant: 'primary',
  scrollable: false,
  size: 'md',
  static: false,
});
const emit = defineEmits<BaseModalEmits>();
const visible: ModelRef<boolean> = defineModel<boolean>('visible', {
  default: false,
});

const modalElement = ref<HTMLDivElement | null>(null);
let modalInstance: Modal | null = null;

const dialogClasses = computed(() => ({
  [`modal-${props.size}`]: true,
  'modal-dialog-centered': props.centered,
  'modal-dialog-scrollable': props.scrollable,
}));

watch(
  () => visible.value,
  (visible: boolean) => {
    if (!modalInstance) {
      return;
    }
    if (visible) {
      modalInstance.show();
    } else {
      modalInstance.hide();
    }
    emit('change', visible);
  }
);

const createCancelableEvent = (type: string): CustomEvent => {
  return new CustomEvent(type, { cancelable: true, bubbles: true });
};

const handleEvent = (eventName: string): void => {
  const event = createCancelableEvent(eventName);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(eventName as any, event);
  if (!event.defaultPrevented) {
    modalInstance?.hide();
  }
};

const handleCancel = () => handleEvent('cancel');
const handleClose = () => handleEvent('close');
const handleOk = () => handleEvent('ok');
const handleShown = (): void => emit('shown');
const handleHidden = (): void => emit('hidden');

const handleHide = (): void => {
  const event = createCancelableEvent('hide');
  emit('hide', event);
  if (event.defaultPrevented) {
    return;
  }
  visible.value = false;
};

const handleShow = (): void => {
  const event = createCancelableEvent('show');
  emit('show', event);
  if (event.defaultPrevented) {
    return;
  }
  visible.value = true;
};

const registerEvents = (register: boolean) => {
  const method = register ? 'addEventListener' : 'removeEventListener';
  if (modalElement.value) {
    modalElement.value[method](HIDE_EVENT_TYPE, handleHide);
    modalElement.value[method](HIDDEN_EVENT_TYPE, handleHidden);
    modalElement.value[method](SHOW_EVENT_TYPE, handleShow);
    modalElement.value[method](SHOWN_EVENT_TYPE, handleShown);
  }
};

onMounted((): void => {
  if (modalElement.value) {
    modalInstance = new Modal(modalElement.value, {
      backdrop: props.static ? 'static' : true,
      keyboard: !props.noCloseOnEsc,
    });
    registerEvents(true);
  }
});

onUnmounted(() => {
  registerEvents(false);
  modalInstance = null;
});
</script>
