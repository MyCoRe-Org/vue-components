<template>
  <BaseModal
    id="confirmModal"
    v-model:visible="state.isOpen"
    :title="state.title"
    :cancel-title="state.options?.cancelTitle"
    :cancel-variant="state.options?.cancelVariant"
    :ok-only="state.options?.okOnly"
    :ok-title="state.options?.okTitle"
    :ok-variant="state.options?.okVariant"
    static
    @ok="state.confirm"
    @cancel="state.cancel"
  >
    {{ state.message }}
  </BaseModal>
</template>

<script setup lang="ts">
import { useConfirmModal } from '@/composables/use-confirm-modal';
import BaseModal from './BaseModal.vue';

const { state } = useConfirmModal();
</script>
