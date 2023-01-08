
export type SdModel = {
  title: string;
  model_name: string;
  hash: string;
  filename: string;
  config: string;
};

export const useSdConfig = () => {
  const { fetchSdStatus, fetchSdLogs, sendStartSdEngine, sendStopSdEngine, sendSetSdModel, fetchSdVariables } = useApi();

  const status = ref<'Running' | 'Stopped' | ''>('');
  const runningFrom = ref('');

  const refreshSdStatus = async () => {
    const response = await fetchSdStatus();
    const isRunning = response.status === 'running';
    status.value = isRunning ? 'Running' : 'Stopped';
    runningFrom.value = isRunning ? response.statusTxt : '';
    if(!isRunning) {
      embeddings.value = [];
      models.value = [];
      configs.value = {};
      return;
    }
    const { sdModels: fetchedModels, embeddings: fetchedEmbeddings, sdConfigs: fetchedConfigs } = await fetchSdVariables();
    models.value = fetchedModels;
    embeddings.value = fetchedEmbeddings;
    configs.value = fetchedConfigs;
    selectedModel.value = configs.value['sd_model_checkpoint'];
  }

  const loadingStartSd = ref(false);
  const startSd = async () => {
    loadingStartSd.value = true;
    try {
      await sendStartSdEngine();
      await new Promise(resolve => setTimeout(resolve, 200));
      await refreshSdStatus();
    } catch (e) {
      console.log(`Error starting SD: ${e}`);
    } finally {
      loadingStartSd.value = false;
    }
  }

  const loadingStopSd = ref(false);
  const stopSd = async () => {
    loadingStopSd.value = true;
    try {
      await sendStopSdEngine();
    } catch (e) {
      console.log(`Error stopping SD: ${e}`);
    }
    loadingStopSd.value = false;
    await new Promise(resolve => setTimeout(resolve, 200));
    await fetchSdStatus();
  }

  const logs = ref('');
  const getSdLogs = async () => {
    const response = await fetchSdLogs();
    logs.value = response;
  }

  // Models

  const models = ref<SdModel[]>([]);
  const embeddings = ref<string[]>([]);
  const configs = ref<Record<string, string>>({});

  const selectedModel = ref('');
  const loadingModel = ref(false);
  const selectModel = async () => {
    loadingModel.value = true;
    await sendSetSdModel(selectedModel.value);
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
    configs,
    refreshSdStatus,
    selectModel,
    loadingModel,
    selectedModel,
    embeddings,
  }
}