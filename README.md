# Artificial Art Manager

The purpose of this application is to help users generate images pushing request to a queue, view and filter the generated images, and later categorize them with a tinder-like UI.

The frontend is built using [Vue 3](https://vuejs.org/), [Nuxt 3](https://nuxt.com/), [Vuetify 3](https://next.vuetifyjs.com/en/) and [Socket.IO](https://socket.io/). <br>
And the backend is built using [NestJs](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), [MongoDB](https://www.mongodb.com/home), and [Redis](https://redis.io/). <br>
The E2E test are written using [Playwright](https://playwright.dev/).

The images are generated using the [Stable Diffusion](https://github.com/Stability-AI/stablediffusion) model through the [AUTOMATIC1111 webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) using the handy [`--api` argument](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API).

## 📋 Features

- Queue image generation using Stable Diffusion
- View and filter generated images
- Categorize images with a tinder-like UI
- Real-time updates and push notifications using Socket.IO
- Start and stop the AUTOMATIC1111 webui docker container through the UI

## 📷 Screenshot

<img src="/tests/e2e/screenshots/play/play-page-Samsung-Galaxy-Note-Lite-10.png?raw=true" alt="Generate page screenshot" height="400" />

## 💻 Tech Stack

- Frontend: [Vue 3](https://vuejs.org/), [Nuxt 3](https://nuxt.com/), [Vuetify 3](https://next.vuetifyjs.com/en/), [Socket.IO](https://socket.io/)
- Backend: [NestJs](https://nestjs.com/), [Prisma ORM](https://www.prisma.io/), [MongoDB](https://www.mongodb.com/home), [Redis](https://redis.io/)
- [Docker compose](https://docs.docker.com/compose/): for running the backend, frontend, and the necessary services
- [Portainer](https://www.portainer.io/): for managing the docker container for the image generation service
- [Stable Diffusion](https://github.com/Stability-AI/stablediffusion) ([AUTOMATIC1111 webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui)): hosted in a docker container managed by Portainer

## 📝 Usage

You can start the application by running `docker-compose up` in the root directory.

The UI will be available at [`http://localhost:3000`](http://localhost:3000/), and the backend API will be available at [`http://localhost:3005`](http://localhost:3005/).

> You may need to configure the corresponding environment variables in the `.env` files in the `root`, `frontend` and `backend` directories.

- In the [`/generate/`](http://localhost:3000/generate/) page you can send image generation requests to the queue and manage the Stable Diffusion docker service. After the queue is empty the application will send a notification.

<img src="/tests/e2e/screenshots/generate/generate-page-Google-Chrome.png?raw=true" alt="Generate page screenshot" width="830" />

- In the [`/gallery/`](http://localhost:3000/gallery/) page you can view and filter the generated images.

<img src="/tests/e2e/screenshots/gallery/gallery-page-Google-Chrome.png?raw=true" alt="Gallery page screenshot" width="830" />

- In the [`/play/`](http://localhost:3000/play/) page you can categorize the images with a tinder-like UI.

<img src="/tests/e2e/screenshots/play/play-page-Google-Chrome.png?raw=true" alt="Play page screenshot" width="830" />

- In the [`/votes/`](http://localhost:3000/votes/) page you can see the images that have been categorized, filtered by vote type (like, dislike, favorite, etc) and with the possibility to add more filters.

<img src="/tests/e2e/screenshots/votes/votes-page-Google-Chrome.png?raw=true" alt="Votes page screenshot" width="830" />

## 🛠️ Development

1. Install Docker and Portainer, then clone this repository
2. Build and run your AUTOMATIC1111 webui docker container [here is the one I'm using](https://github.com/AbdBarho/stable-diffusion-webui-docker), and make sure it's using the `--api` argument
3. In a separate terminal, navigate to the `frontend` directory and run `npm install` to install dependencies
4. Start the frontend server by running `npm run dev`
5. In another separate terminal, navigate to the `backend` directory and run `npm install` to install dependencies
6. Start the backend server by running `npm run start:dev`

> Disclaimer: This is a work in progress, so there are still a lot of things to be done. <br>
> Also this is just a personal project for fun, so don't use it in production or expect quick bug fixes 🙂
