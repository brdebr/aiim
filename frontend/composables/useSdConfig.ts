
export type SdModel = {
  title: string;
  model_name: string;
  hash: string;
  filename: string;
  config: string;
};

export const useSdConfig = () => {
  const status = ref<'Running' | 'Stopped' | ''>('');
  const runningFrom = ref('');
  const logs = ref('');
  const fetchOptions = getFetchOptions();

  const getSdStatus = async () => {
    const response = await $fetch<{status: string, statusTxt: string}>('/api/sd-config/engine-status', fetchOptions);
    status.value = response.status === 'running' ? 'Running' : 'Stopped';
    runningFrom.value = status.value === 'Running' ? response.statusTxt : '';
  }

  const startSd = async () => {
    const response = await $fetch<string>('/api/sd-config/engine-start', {
      ...fetchOptions,
      method: 'POST',
    });
  }

  const stopSd = async () => {
    const response = await $fetch<string>('/api/sd-config/engine-stop', {
      ...fetchOptions,
      method: 'POST',
    });
  }

  const getSdLogs = async () => {
    const response = await $fetch<string>('/api/sd-config/engine-logs', fetchOptions);
    // replacing everything that is not a letter, number, space, or punctuation with empty
    const responseParsedAsValidText = response.replaceAll(/[^a-zA-Z0-9\s\.,?!]/g, '');
    logs.value = responseParsedAsValidText;
  }

  // Models

  const models = ref<SdModel[]>([]);

  const configs = ref<Record<string, string>>({});

  const getSdModels = async () => {
    const response = await $fetch<SdModel[]>('/api/sd-config/sd-models', fetchOptions);
    return response;
  }

  const setSdModel = async (modelTitle: string) => {
    const response = await $fetch<string>('/api/sd-config/sd-model', {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({ modelTitle }),
    });
  }

  const getConfigs = async () => {
    const response = await $fetch<Record<string, string>>('/api/sd-config/configs', fetchOptions);
    configs.value = { ...response};
  }

  return {
    getSdStatus,
    status,
    runningFrom,
    logs,
    startSd,
    stopSd,
    getSdLogs,
    models,
    getSdModels,
    setSdModel,
    getConfigs,
    configs,
  }
}