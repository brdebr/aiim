export const apiBaseUrlDev = import.meta.env.DEV ? 'http://192.168.1.132:3006' : '';
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
  '1.5-inpainting': '3e16efc8',
  '1.4': '7460a6fa',
  'bryanwd-person': 'da781e47',
  '1.5-pruned': 'a9263745',
  '2.0-768-v-ema': '2c02b20a',
} as const;