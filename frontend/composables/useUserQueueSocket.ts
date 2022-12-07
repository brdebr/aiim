import { ImageObject } from '~~/types';
import { io, Socket } from 'socket.io-client'
import { apiWsBaseUrlDev } from '~~/constants';

type ImageGenerationEvent = {
  image: ImageObject;
  queuePosition?: number;
};

export type ProgressResponse = {
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
};

export type useQueueSocketType = {
  imageFinishedCallback?: (generationEvent: ImageGenerationEvent) => void;
  progressCallback?: (progressEvent: ProgressResponse) => void;
  errorCallback?: (error: any) => void;
};

export const useUserQueueSocket = (
  params?: useQueueSocketType,
) => {
  let socket: Socket | undefined;

  const authStore = useAuthStore();
  const { token } = storeToRefs(authStore);

  const initWsConnection = () => {
    socket = io(apiWsBaseUrlDev, {
      transports: ['websocket'],
      auth: {
        token: token.value,
      },
    });
  
    socket.on('connect', () => {
      console.log(`Connected to socket server`);
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socket.on('image_finished', (generationEvent: ImageGenerationEvent) => {
      console.log(`Received image ${generationEvent.image.id} from socket server`);
      params?.imageFinishedCallback?.(generationEvent);
    });

    socket.on('image_on_progress', (progressEvent: ProgressResponse) => {
      params?.progressCallback?.(progressEvent);
    });
  }
  
  onMounted(() => {
    initWsConnection();
  })

  onUnmounted(() => {
    socket?.disconnect()
  })

  return {
    socket,
  }
};
