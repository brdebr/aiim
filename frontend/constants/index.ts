export const apiBaseUrlDev = import.meta.env.VITE_API_BASE_URL;
export const apiWsBaseUrlDev = import.meta.env.VITE_WS_BASE_URL;
export const LOCAL_STORAGE_PREFIX = 'aiim-';

export const Samplers = [
  'Euler a',
  'Euler',
  'LMS',
  'Heun',
  'DPM2',
  'DPM2 a',
  'DPM++ 2S a',
  'DPM++ 2M',
  'DPM++ SDE',
  'DPM fast',
  'DPM adaptive',
  'LMS Karras',
  'DPM2 Karras',
  'DPM2 a Karras',
  'DPM++ 2S a Karras',
  'DPM++ 2M Karras',
  'DPM++ SDE Karras',
  'DDIM',
  'PLMS',
] as const;

export const modelHashesMap = {
  '1.5-emaonly': '81761151',
  '1.5-inpaint': '3e16efc8',
  '1.4': '7460a6fa',
  'bryanwd': 'da781e47',
  '1.5-pruned': 'a9263745',
  '2.0-ema': '2c02b20a',
  '2.1-ema-pruned': '4bdfc29c',
  '2.1-pruned': 'e1542d5a',
} as const;
