<template>
  <BaseError
    :message="t(`${I18N_PREFIX}error.403.message`)"
    :description="t(`${I18N_PREFIX}error.403.description`)"
  />
</template>

<script setup lang="ts">
import BaseError from '@/components/error/BaseError.vue';
import { useI18n } from 'vue-i18n';
import { I18N_PREFIX } from '@/common/i18n-utils';

const { t } = useI18n();
</script>
<style></style>
