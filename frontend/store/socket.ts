import { io, Socket } from "socket.io-client";
import { ImageGenerationEvent } from "~~/composables/useGenerate";
import { apiWsBaseUrlDev } from "~~/constants";
import { ImageObject } from "~~/types";
import { playSound } from "~~/utils/general";

export type ProgressResponse = {
  progress: {
    progress: number;
    eta_relative: number;
    state: {
      skipped: boolean;
      interrupted: boolean;
      job: string;
      job_count: number;
      job_no: number;
      sampling_step: number;
      sampling_steps: number;
    };
    current_image?: string;
  },
  queuePosition: number;
};

export const useSocketStore = definePiniaStore('wsocket', () => {
  const authStore = useAuthStore();
  const { token } = storeToRefs(authStore);

  let socket: Socket | undefined;

  const connectHook = createEventHook<void>();
  const disconnectHook = createEventHook<void>();

  const imageFinishedHook = createEventHook<ImageGenerationEvent>();
  const progressHook = createEventHook<ProgressResponse>();

  const imagesInQueue = ref(0);
  const progress = ref(0);
  const eta = ref(0);
  const previewImage = ref<string>('');

  const generatedImages = ref<ImageObject[]>([]);

  const { show } = useWebNotification({
    title: 'Finished generating images!',
    dir: 'auto',
    lang: 'en',
    tag: 'txt2img',
    renotify: true,
  });

  const notify = () => {
    show();
    playSound('notification-pretty-good.mp3');
  };

  const initWsConnection = () => {
    if (socket) return;
    socket = io(apiWsBaseUrlDev, {
      transports: ['websocket'],
      auth: {
        token: token.value,
      },
    });

    socket.on('connect', () => {
      console.log(`Connected to socket server`);
      connectHook.trigger();
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      disconnectHook.trigger();
    });

    socket.on('image_on_progress', (progressEvent: ProgressResponse) => {
      progressHook.trigger(progressEvent);
    });

    socket.on('image_finished', (generationEvent: ImageGenerationEvent) => {
      console.log('Generated Image id: ', generationEvent.image.id);
      imageFinishedHook.trigger(generationEvent);
      imagesInQueue.value--;
      if (imagesInQueue.value === 0) {
        resetProgressState();
        notify();
      }
      generatedImages.value.unshift(generationEvent.image);
    });

    socket.on('image_on_progress', (progressEvent: ProgressResponse) => {
      progressHook.trigger(progressEvent);
      progress.value = progressEvent.progress.progress * 100;
      eta.value = progressEvent.progress.eta_relative;
      previewImage.value = progressEvent.progress.current_image
        ? `data:image/png;base64,${progressEvent.progress.current_image}`
        : '';
    });
  };

  const closeConnection = () => {
    if (!socket) return;
    socket.disconnect();
    socket = undefined;
  };

  const resetProgressState = () => {
    progress.value = 0;
    eta.value = 0;
    previewImage.value = '';
    imagesInQueue.value = 0;
  };

  return {
    socket,
    initWsConnection,
    connectHook,
    closeConnection,
    disconnectHook,
    imageFinishedHook,
    progressHook,
    imagesInQueue,
    progress,
    eta,
    previewImage,
    resetProgressState,
    generatedImages,
  };
});
