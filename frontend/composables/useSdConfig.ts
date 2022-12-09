
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
    if (status.value !== 'Running') return;
    await getConfigs();
  }

  const startSd = async () => {
    const response = await $fetch<string>('/api/sd-config/engine-start', {
      ...fetchOptions,
      method: 'POST',
    });
  }

  const loadingStopSd = ref(false);
  const stopSd = async () => {
    loadingStopSd.value = true;
    const response = await $fetch<string>('/api/sd-config/engine-stop', {
      ...fetchOptions,
      method: 'POST',
    });
    loadingStopSd.value = false;
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

  const selectedModel = ref('');
  const loadingModel = ref(false);
  const selectModel = async () => {
    loadingModel.value = true;
    await setSdModel(selectedModel.value);
    loadingModel.value = false;
  };

  const refresh = async () => {
    await getSdStatus();
    if ( status.value !== 'Running' ) return;
    [models.value] = await Promise.all([getSdModels(), getConfigs()]);
    selectedModel.value = configs.value['sd_model_checkpoint'];
  }

  return {
    getSdStatus,
    status,
    runningFrom,
    logs,
    startSd,
    stopSd,
    loadingStopSd,
    getSdLogs,
    models,
    getSdModels,
    setSdModel,
    getConfigs,
    configs,
    refresh,
    selectModel,
    loadingModel,
    selectedModel,
  }
}