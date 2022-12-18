export default defineNuxtPlugin(() => {
  addRouteMiddleware('global-auth-middleware', async (to) => {
    const auth = useAuthStore();
    const socket = useSocketStore();

    const nowDate = new Date().getTime();
    const expDate = new Date(auth.loginInfo.exp || 0).getTime();

    const isExpired = expDate < nowDate;
    const isLoginPage = to.path === '/';

    const resetState = () => {
      console.log('Token expired, resetting state');
      socket.closeConnection();
      auth.cleanAuth();
    };

    if (isLoginPage) {
      if (isExpired) {
        resetState();
        return;
      }
      socket.initWsConnection();
      return navigateTo('/generate');
    }
    
    if (isExpired) {
      resetState();
      return navigateTo('/');
    }

    console.log(`Token is valid:`);
    console.log(`Expiring at ${new Date(auth.loginInfo.exp || 0).toLocaleString()}`);
    console.log(`Expires in ${auth.minutesToExpire().toFixed(2)} minutes`);

    socket.initWsConnection();
  }, { global: true })
})