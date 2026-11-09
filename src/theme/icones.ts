/**
 * Ícones do app em emoji: não dependem de nenhuma biblioteca extra (o @expo/vector-icons
 * não vem mais instalado no template da SDK 58) e funcionam no Android e no iPhone.
 */
export const ICONES = {
  'checkmark-circle': '✅',
  warning: '⚠️',
  'alert-circle': '🚨',
  'information-circle': 'ℹ️',
  'cloud-offline': '📴',
  refresh: '🔄',
  'swap-horizontal': '🔁',
  'checkmark-done': '✔️',
  trash: '🗑️',
  'add-circle': '➕',
  save: '💾',
  'person-add': '👤',
  'shield-checkmark': '🛡️',
  wifi: '📶',
  pulse: '📊',
  'document-text': '📝',
  notifications: '🔔',
  water: '💧',
  person: '👤',
} as const;

export type NomeIcone = keyof typeof ICONES;
