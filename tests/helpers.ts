import { createI18n } from 'vue-i18n';

export const createTestI18n = (messages: Record<string, string> = {}) =>
  createI18n({
    legacy: false,
    locale: 'en',
    missingWarn: false,
    fallbackWarn: false,
    messages: { en: messages },
  });

export const findModal = (id: string): HTMLElement | null =>
  document.body.querySelector<HTMLElement>(`#${id}`);

export const isModalShown = (id: string): boolean =>
  findModal(id)?.classList.contains('show') ?? false;
