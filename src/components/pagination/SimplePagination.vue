<template>
  <nav>
    <ul class="pagination">
      <li class="page-item" :class="previousButtonDisabled ? 'disabled' : ''">
        <button
          class="page-link"
          aria-label="Go to first page"
          :disabled="previousButtonDisabled"
          :aria-disabled="previousButtonDisabled"
          @click="jumpToPage(modelValue - 1)"
        >
          {{ prevText }}
        </button>
      </li>
      <li
        v-for="page in pages"
        :key="page"
        class="page-item"
        :class="page === modelValue ? 'active' : ''"
      >
        <button
          class="page-link"
          :aria-label="String(page)"
          :aria-current="page === modelValue"
          :aria-disabled="page === modelValue"
          :disabled="page === modelValue"
          @click="jumpToPage(page)"
        >
          {{ page }}
        </button>
      </li>
      <li class="page-item" :class="nextButtonDisabled ? 'disabled' : ''">
        <button
          class="page-link"
          aria-label="Go to last page"
          :disabled="nextButtonDisabled"
          :aria-disabled="nextButtonDisabled"
          @click="jumpToPage(modelValue + 1)"
        >
          {{ nextText }}
        </button>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { computed, ModelRef } from 'vue';
import { PaginationOptions, PaginationEmits } from './types';

const props = withDefaults(defineProps<PaginationOptions>(), {
  prevText: '‹',
  nextText: '›',
  perPage: 20,
});

const modelValue: ModelRef<number> = defineModel<number>({
  required: true,
});

const emit = defineEmits<PaginationEmits>();

const totalPages = computed((): number =>
  Math.ceil(props.totalRows / props.perPage)
);
const nextButtonDisabled = computed(
  (): boolean => modelValue.value === totalPages.value || props.totalRows === 0
);
const previousButtonDisabled = computed((): boolean => modelValue.value === 1);
const pages = computed((): number[] => {
  if (props.totalRows === 0) {
    return [1];
  }
  const range: number[] = [];
  for (let i = 1; i <= totalPages.value; i += 1) {
    range.push(i);
  }
  return range;
});

const jumpToPage = (page: number): void => {
  if (page <= 0 || page > totalPages.value || page === modelValue.value) {
    return;
  }
  emit('change-page', page);
};
</script>
