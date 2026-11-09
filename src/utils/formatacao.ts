const dois = (n: number): string => String(n).padStart(2, '0');

/**
 * Converte um texto ISO em Date. Alguns servidores mandam microssegundos
 * ("...:00.123456Z"); cortamos para milissegundos para o parser do Hermes aceitar.
 */
export function paraData(iso: string): Date {
  return new Date(iso.replace(/(\.\d{3})\d+/, '$1'));
}

export function formatarHora(iso: string): string {
  const d = paraData(iso);
  if (Number.isNaN(d.getTime())) return '--:--';
  return `${dois(d.getHours())}:${dois(d.getMinutes())}`;
}

export function formatarDataHora(iso: string): string {
  const d = paraData(iso);
  if (Number.isNaN(d.getTime())) return '--/-- --:--';
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)} ${dois(d.getHours())}:${dois(d.getMinutes())}`;
}

/** "agora", "há 5 min", "há 3 h" ou data e hora (para itens mais antigos). */
export function tempoRelativo(iso: string, agora: number = Date.now()): string {
  const d = paraData(iso);
  if (Number.isNaN(d.getTime())) return '';
  const minutos = Math.floor((agora - d.getTime()) / 60000);
  if (minutos < 1) return 'agora';
  if (minutos < 60) return `há ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `há ${horas} h`;
  return formatarDataHora(iso);
}

export function formatarNivel(nivelCm: number | null): string {
  return nivelCm === null ? 'sem leitura' : `${Math.round(nivelCm)} cm`;
}
