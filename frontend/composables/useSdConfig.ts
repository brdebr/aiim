
export const useSdConfig = () => {
  const status = ref('');
  const runningFrom = ref('');
  const logs = ref('');
  const fetchOptions = getFetchOptions();

  const getSdStatus = async () => {
    const response = await $fetch<{status: string, statusTxt: string}>('/api/sd-config/engine-status', fetchOptions);
    status.value = response.status === 'running' ? 'Running' : 'Stopped';
    if (status.value === 'Running') runningFrom.value = response.statusTxt;
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
    const responseParsedAsValidText = response.replace(/[^a-zA-Z0-9\s\.,?!]/g, '');
    logs.value = responseParsedAsValidText;
  }

  return {
    getSdStatus,
    status,
    runningFrom,
    logs,
    startSd,
    stopSd,
    getSdLogs
  }
}