import { exec } from "child_process";

const matchImageData = (imageData) => {
  const regex = /\s{4}parameters:(.*(\r?\n).*(\r?\n).*)/gm;
  const matches = regex.exec(imageData);
  return matches[0].replace(/\s{4}parameters:/g, "").trim();
};

const modelHashes = {
  "1.5-emaonly": "81761151",
  "1.5-inpainting": "3e16efc8",
  "1.4": "7460a6fa",
  "bryanwd-person": "da781e47",
  "1.5-pruned": "a9263745",
};


const imageDataToObject = (imageData) => {
  const parsedImageData = imageData.replace(/\r\n(.*)png:IHDR.bit-depth-orig(.*)/g, "").trim();
  const imageObject = {};
  const prompt = /^(.*)(\r?\n)/gm.exec(parsedImageData)[0].replace(/\r?\n/g, "");
  const negativePrompt = /Negative\sprompt:(.*)\r?\n/gm.exec(parsedImageData)?.[0].replace(/\r?\n/g, "").replace("Negative prompt:", "").trim();
  const steps = /Steps:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Steps:", "").trim();
  const sampler = /Sampler:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Sampler:", "").trim();
  const cfg = /CFG scale:([^,]+)/gm.exec(parsedImageData)?.[0].replace("CFG scale:", "").trim();
  const seed = /Seed:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Seed:", "").trim();
  const size = /Size:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Size:", "").trim();
  const width = size.split("x")?.[0];
  const height = size.split("x")?.[1];
  const modelHash = /Model hash:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Model hash:", "").trim();
  const model = Object.keys(modelHashes).find(key => modelHashes[key] === modelHash);
  const denoising = /Denoising strength:([^,]+)/gm.exec(parsedImageData)?.[0].replace("Denoising strength:", "").trim();
  const firstPass = /First pass size:([^,]+)/gm.exec(parsedImageData)?.[0].replace("First pass size:", "").trim();

  imageObject["prompt"] = prompt || undefined;
  imageObject["negativePrompt"] = negativePrompt || undefined;

  imageObject["steps"] = steps ? parseFloat(steps) : undefined;
  imageObject["sampler"] = sampler || undefined;
  imageObject["cfg"] = cfg ? parseFloat(cfg) : undefined;
  imageObject["seed"] = seed || undefined;
  imageObject["width"] = width ? parseInt(width) : undefined;
  imageObject["height"] = height ? parseInt(height) : undefined;
  imageObject["modelHash"] = modelHash || undefined;
  imageObject["model"] = model || undefined;
  imageObject["denoising"] = denoising ? parseFloat(denoising) : undefined;
  imageObject["firstPass"] = firstPass || undefined;
  imageObject["rawText"] = parsedImageData;
  return imageObject;
}

const getImageData = async (imageRoute) => {
  if (!imageRoute.includes(".png")) {
    throw new Error("Image route must be a png file, was: " + imageRoute);
  }
  const imageMagickCommand = `magick identify -verbose "${imageRoute}"`;
  return new Promise((resolve, reject) => {
    exec(imageMagickCommand, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      // console.log(stdout);
      resolve(matchImageData(stdout));
    });
  });
};

const getImageObject = async (imageRoute) => {
  const imageData = await getImageData(imageRoute);
  const imageObject = imageDataToObject(imageData);
  return imageObject;
};


//----------------------------------


const imagesPath = "D:\\dev\\git\\outputs_old_000\\txt2img-images";
// const imagesPath = "D:\\dev\\git\\sd-webui\\log\\images\\";

import { readdirSync } from "fs";
const images = readdirSync(imagesPath);
const imagesRoutes = images.map((image) => `${imagesPath}\\${image}`);

// async for loop
for await (const imageRoute of imagesRoutes) {
  console.log(imageRoute);
  const imageObject = await getImageObject(imageRoute);
  console.log(imageObject);
}



