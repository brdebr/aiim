
export type SdModel = {
  title: string;
  model_name: string;
  hash: string;
  filename: string;
  config: string;
};

export const useSdConfig = () => {
  const fetchOptions = getFetchOptions();

  const status = ref<'Running' | 'Stopped' | ''>('');
  const runningFrom = ref('');
  const fetchSdStatus = async () => {
    const response = await $fetch<{status: string, statusTxt: string}>('/api/sd-config/engine-status', fetchOptions);
    status.value = response.status === 'running' ? 'Running' : 'Stopped';
    runningFrom.value = status.value === 'Running' ? response.statusTxt : '';
  }

  const loadingStartSd = ref(false);
  const startSd = async () => {
    loadingStartSd.value = true;
    try {
      await $fetch<string>('/api/sd-config/engine-start', {
        ...fetchOptions,
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
          ...fetchOptions.headers
        },
      });
      await new Promise(resolve => setTimeout(resolve, 200));
      await refresh();
    } catch (e) {
      console.log(`Error starting SD: ${e}`);
    } finally {
      loadingStartSd.value = false;
    }
  }

  const refresh = async () => {
    await fetchSdStatus();
    if ( status.value !== 'Running' ) return;
    await Promise.all([fetchSdModels(), fetchEmbeddings(), fetchConfigs()]);
    selectedModel.value = configs.value['sd_model_checkpoint'];
  }

  const loadingStopSd = ref(false);
  const stopSd = async () => {
    loadingStopSd.value = true;
    try {
      await $fetch<string>('/api/sd-config/engine-stop', {
        ...fetchOptions,
        method: 'POST',
      });
    } catch (e) {
      console.log(`Error stopping SD: ${e}`);
    }
    loadingStopSd.value = false;
    await new Promise(resolve => setTimeout(resolve, 200));
    await fetchSdStatus();
  }

  const logs = ref('');
  const getSdLogs = async () => {
    const response = await $fetch<string>('/api/sd-config/engine-logs', fetchOptions);
    // replacing everything that is not a letter, number, space, or punctuation with empty
    const responseParsedAsValidText = response.replaceAll(/[^a-zA-Z0-9\s\.,?!]/g, '');
    logs.value = responseParsedAsValidText;
  }

  // Models

  const models = ref<SdModel[]>([]);
  const fetchSdModels = async () => {
    const response = await $fetch<SdModel[]>('/api/sd-config/sd-models', fetchOptions);
    models.value = response;
  }

  const embeddings = ref<string[]>([]);
  const fetchEmbeddings = async () => {
    const response = await $fetch<string[]>('/api/sd-config/embeddings', fetchOptions);
    embeddings.value = response;
  }

  const configs = ref<Record<string, string>>({});
  const fetchConfigs = async () => {
    const response = await $fetch<Record<string, string>>('/api/sd-config/configs', fetchOptions);
    configs.value = { ...response};
  }


  const setSdModel = async (modelTitle: string) => {
    const response = await $fetch<string>('/api/sd-config/sd-model', {
      ...fetchOptions,
      method: 'POST',
      body: JSON.stringify({ modelTitle }),
    });
  }

  const selectedModel = ref('');
  const loadingModel = ref(false);
  const selectModel = async () => {
    loadingModel.value = true;
    await setSdModel(selectedModel.value);
    loadingModel.value = false;
  };

  return {
    status,
    runningFrom,
    logs,
    startSd,
    stopSd,
    loadingStopSd,
    loadingStartSd,
    getSdLogs,
    models,
    fetchSdModels,
    setSdModel,
    fetchConfigs,
    configs,
    refresh,
    selectModel,
    loadingModel,
    selectedModel,
    embeddings,
    fetchEmbeddings,
  }
}