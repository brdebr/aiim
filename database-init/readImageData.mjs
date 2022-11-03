import { exec } from "child_process";

const matchImageDataImageMagick = (imageData) => {
  const regex = /\s{4}parameters:(.*(\r?\n).*(\r?\n).*)/gm;
  const matches = regex.exec(imageData);
  return matches?.[0].replace(/\s{4}parameters:/g, "").trim() || imageData;
};

const findImageData = (imageData) => {
  const regex = /Parameters\s*:\s(.*)/gm;
  const matches = regex.exec(imageData);
  return matches?.[0].replace(/Parameters\s*:\s/g, "").trim() || imageData;
};

const modelHashes = {
  "1.5-emaonly": "81761151",
  "1.5-inpainting": "3e16efc8",
  "1.4": "7460a6fa",
  "bryanwd-person": "da781e47",
  "1.5-pruned": "a9263745",
};


const imageDataToObject = (imageData, imageRoute) => {
  const parsedImageData = imageData.trim();
  const imageObject = {};
  const prompt = /^(.*)(Negative\sprompt:|Steps:)/gm.exec(parsedImageData)?.[0].replace(/(\.Negative\sprompt:|\.Steps:)/g, "");
  const negativePrompt = /Negative\sprompt:(.*)\r?\n/gm.exec(parsedImageData)?.[0].replace(/\r?\n/g, "").replace("Negative prompt:", "").trim();
  const steps = /Steps:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Steps:", "").trim();
  const sampler = /Sampler:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Sampler:", "").trim();
  const cfg = /CFG scale:([^,]+)/gm.exec(parsedImageData)?.[0].replace("CFG scale:", "").trim();
  const seed = /Seed:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Seed:", "").trim();
  const size = /Size:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Size:", "").trim() || '';
  const width = size.split("x")?.[0];
  const height = size.split("x")?.[1];
  const modelHash = /Model hash:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Model hash:", "").trim();
  const model = Object.keys(modelHashes).find(key => modelHashes[key] === modelHash);
  const denoising = /Denoising strength:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Denoising strength:", "").trim();
  const firstPass = /First pass size:([^,]+)/gm.exec(parsedImageData)?.[0].replace("First pass size:", "").trim();
  const faceRestoration = /Face restoration:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Face restoration:", "").trim();

  imageObject["imagePath"] = imageRoute.split("/").pop();
  imageObject["number"] = `${imageObject["imagePath"]}`.substring(0, 5);
  imageObject["prompt"] = prompt || null;
  imageObject["negativePrompt"] = negativePrompt || null;

  imageObject["steps"] = steps ? parseFloat(steps) : null;
  imageObject["sampler"] = sampler || null;
  imageObject["cfg"] = cfg ? parseFloat(cfg) : null;
  imageObject["seed"] = seed || null;
  imageObject["width"] = width ? parseInt(width) : null;
  imageObject["height"] = height ? parseInt(height) : null;
  imageObject["modelHash"] = modelHash || null;
  imageObject["model"] = model || null;
  imageObject["denoisingHr"] = denoising ? parseFloat(denoising) : null;
  imageObject["firstPassHr"] = firstPass || null;
  imageObject["faceRestoration"] = faceRestoration || null;
  imageObject["rawParameters"] = parsedImageData || imageData;
  return imageObject;
}

const getImageData = async (imageRoute) => {
  if (!imageRoute.includes(".png")) {
    throw new Error("Image route must be a png file, was: " + imageRoute);
  }
  // const imageMagickCommand = `magick identify -verbose "${imageRoute}"`;
  const effixComand = `exiftool "${imageRoute}"`;
  return new Promise((resolve, reject) => {
    exec(effixComand, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      const rawText = stdout;
      const greppedText = findImageData(rawText);
      resolve(greppedText || rawText);
    });
  });
};

const getImageObject = async (imageRoute) => {
  const imageData = await getImageData(imageRoute);
  const imageObject = imageDataToObject(imageData, imageRoute);
  return imageObject;
};


//----------------------------------


const imagesPath = "/home/bryan-ub/DEV/MULTIMEDIA/AI generated/Volumes/outputs_old_000/txt2img-images";
// const imagesPath = "D:\\dev\\git\\sd-webui\\log\\images\\";

import { readdirSync } from "fs";
const images = readdirSync(imagesPath);
const imagesRoutes = images.map((image) => `${imagesPath}/${image}`);

console.log(`Processing ${imagesRoutes.length} images -->`);
let i = 0;

// async for loop
for await (const imageRoute of imagesRoutes) {
  console.log('---------------------');
  const percentCompleted = ((i / imagesRoutes.length) * 100).toFixed(2);
  console.log(`Processing image: ${i}/${imagesRoutes.length} - ${percentCompleted}%`);
  console.log(imageRoute);
  console.log('---------------------');
  const imageObject = await getImageObject(imageRoute);
  console.log(imageObject);
  i++;
}



