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

## Tech Stack

- Frontend: Vue 3, Nuxt 3, Vuetify 3, Socket.IO
- Backend: NestJs, PrismaDB, MongoDB, Redis
- AUTOMATIC1111 webui: hosted in a docker container

## Installation

1. Install Docker and clone this repository
2. Build and run your AUTOMATIC1111 webui docker container [here is the one I'm using](https://github.com/AbdBarho/stable-diffusion-webui-docker)
4. In a separate terminal, navigate to the `frontend` directory and run `npm install` to install dependencies
5. Start the frontend server by running `npm run dev`
6. In another separate terminal, navigate to the `backend` directory and run `npm install` to install dependencies
7. Start the backend server by running `npm run start:dev`

## Usage

1. Navigate to `http://localhost:3001` in your browser to access the application
2. Use the UI to queue image generation, view and filter images, and categorize them
3. Real-time updates and push notifications will be received through Socket.IO

You may need to configure the corresponding environment variables in the `.env` files in the `root`, `frontend` and `backend` directories.
