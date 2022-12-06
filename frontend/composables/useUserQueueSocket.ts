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

export const useUserQueueSocket = (
  callback: (generationEvent: ImageGenerationEvent) => void,
) => {
  let socket: Socket | undefined;

  const authStore = useAuthStore();
  const { userId } = storeToRefs(authStore);

  const progress = ref(0);
  const eta = ref(0);

  const outputProgress = useTransition(progress, {
    duration: 250,
  })
  const outputEta = useTransition(eta, {
    duration: 250,
  })


  onMounted(() => {
    socket = io(apiWsBaseUrlDev, {
      transports: ['websocket'],
    });
  
    socket.on('connect', () => {
      console.log(`Connected to socket server`);
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    socket.on('image_finished', (generationEvent: ImageGenerationEvent) => {
      console.log(`Received image ${generationEvent.image.id} from socket server`);
      callback(generationEvent);
    });

    socket.on('image_on_progress', (progressEvent: ProgressResponse) => {
      progress.value = (progressEvent.progress * 100);
      eta.value = progressEvent.eta_relative;
    });
  
    joinQueue();
  })

  const joinQueue = () => {
    console.log(`Joining queue for user: ${userId.value}`);
    socket?.emit('user_queue_enter', userId.value);
  }
  const leaveQueue = () => {
    console.log(`Leaving queue for user: ${userId.value}`);
    socket?.emit('user_queue_leave', userId.value);
  }

  onUnmounted(() => {
    leaveQueue();
    socket?.disconnect()
  })

  return {
    socket,
    progress,
    eta,
    outputProgress,
    outputEta,
  }
};
