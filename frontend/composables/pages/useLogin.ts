
export const useLogin = async () => {
  const router = useRouter();
  const authStore = useAuthStore();
  const socket = useSocketStore();

  const loginEmail = ref('');
  const loginPassword = ref('');

  const loading = ref(false);

  const executeLogin = async () => {
    loading.value = true;
    try {
      await authStore.login(loginEmail.value, loginPassword.value);
      socket.initWsConnection();
      router.push('/generate');
    } catch (error) {
      console.log('Error logging in:', error);
    } finally {
      loading.value = false;
    }
  };

  return {
    // Form
    loginEmail,
    loginPassword,
    loading,
    // Methods
    executeLogin,
  };
};
