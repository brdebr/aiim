# Artificial Art Manager

A web application built using Vue 3, Nuxt 3, and Vuetify 3 for the frontend.

And for the backend NestJs, PrismaDB, MongoDB, and Redis.

The purpose of this application is to help users generate images pushing request to a queue, view and filter the generated images, and later categorize them with a tinder-like UI.

The images are generated using the Stable Diffusion model through the [AUTOMATIC1111 webui](https://github.com/AUTOMATIC1111/stable-diffusion-webui) using the handy `--api` argument.

## Features

- Queue image generation using the AUTOMATIC1111 API
- View and filter generated images
- Categorize images with a tinder-like UI
- Real-time updates and push notifications using Socket.IO
- Start and stop the AUTOMATIC1111 webui docker container through the UI

## Tech Stack

- Frontend: Vue 3, Nuxt 3, Vuetify 3, Socket.IO
- Backend: NestJs, PrismaDB, MongoDB, Redis
- Docker: for running the backend, frontend, and the necessary services
- AUTOMATIC1111 webui: hosted in a docker container
- Portainer: for managing the docker container

## Usage

The application is dockerized and can be run using docker-compose.

You can start the services by running `docker-compose up` in the root directory.

The UI will be available at `http://localhost:3000`, and the backend API will be available at `http://localhost:3005`.

- In the `/generate/` page you can send image generation requests to the queue and manage the Stable Diffusion docker service. After the queue is empty the application will send a notification.

<img src="/tests/e2e/screenshots/generate/generate-page-Google-Chrome.png" alt="Generate page screenshot" width="830" />

- In the `/gallery/` page you can view and filter the generated images.

<img src="/tests/e2e/screenshots/gallery/gallery-page-Google-Chrome.png" alt="Gallery page screenshot" width="830" />

- In the `/play/` page you can categorize the images with a tinder-like UI.

<img src="/tests/e2e/screenshots/play/play-page-Google-Chrome.png" alt="Play page screenshot" width="830" />

- In the `/votes/` page you can see the images that have been categorized, filtered by vote type (like, dislike, favorite, etc) and with the possibility to add more filters.

<img src="/tests/e2e/screenshots/votes/votes-page-Google-Chrome.png" alt="Votes page screenshot" width="830" />

## Development

1. Install Docker and Portainer, then clone this repository
2. Build and run your AUTOMATIC1111 webui docker container [here is the one I'm using](https://github.com/AbdBarho/stable-diffusion-webui-docker), and make sure it's using the `--api` argument
3. In a separate terminal, navigate to the `frontend` directory and run `npm install` to install dependencies
4. Start the frontend server by running `npm run dev`
5. In another separate terminal, navigate to the `backend` directory and run `npm install` to install dependencies
6. Start the backend server by running `npm run start:dev`

You may need to configure the corresponding environment variables in the `.env` files in the `root`, `frontend` and `backend` directories.
