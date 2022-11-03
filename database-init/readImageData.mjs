import { exec } from "child_process";

const matchImageData = (imageData) => {
    // imageData.match(/\s{4}parameters:*\s{4}/g)
    const regex = /\s{4}parameters:(.*(\r?\n).*(\r?\n).*)/gm;
    const matches = regex.exec(imageData);
    // console.log(imageData);
    return matches[0].replace(/\s{4}parameters:/g, "").trim();
};

const modelHashes = {
    '1.5-emaonly': '81761151',
    '1.5-inpainting': '3e16efc8',
    '1.4': '7460a6fa',
    'bryanwd-person': 'da781e47',
    '1.5-pruned': 'a9263745',
};


const imageDataToObject = (imageData) => {
    const imageObject = {};
    const prompt = /^(.*)(\r?\n)/gm.exec(imageData)[0].replace(/\r?\n/g, "");
    const negativePrompt = /Negative\sprompt:(.*)\r?\n/gm.exec(imageData)[0].replace(/\r?\n/g, "").replace("Negative prompt:", "").trim();
    const steps = /Steps:([^,]+)/gm.exec(imageData)[0].replace("Steps:", "").trim();
    const sampler = /Sampler:([^,]+)/gm.exec(imageData)[0].replace("Sampler:", "").trim();
    const cfg = /CFG scale:([^,]+)/gm.exec(imageData)[0].replace("CFG scale:", "").trim();
    const seed = /Seed:([^,]+)/gm.exec(imageData)[0].replace("Seed:", "").trim();
    const size = /Size:([^,]+)/gm.exec(imageData)[0].replace("Size:", "").trim();
    const width = size.split("x")[0];
    const height = size.split("x")[1];
    const modelHash = /Model hash:([^,]+)/gm.exec(imageData)[0].replace("Model hash:", "").trim();
    const model = Object.keys(modelHashes).find(key => modelHashes[key] === modelHash);
    const denoising = /Denoising strength:([^,]+)/gm.exec(imageData)[0].replace("Denoising strength:", "").trim();
    const firstPass = /First pass size:([^,]+)/gm.exec(imageData)[0].replace("First pass size:", "").trim();

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
    return imageObject;
}

const getImageData = async (imageRoute) => {
  const imageMagickCommand = `magick identify -verbose ${imageRoute}`;
  return new Promise((resolve, reject) => {
    exec(imageMagickCommand, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      resolve(matchImageData(stdout));
    });
  });
};

const getImageObject = async (imageRoute) => {
    const imageData = await getImageData(imageRoute);
    const imageObject = imageDataToObject(imageData);
    return imageObject;
};

// const imageRoute = "D:\\dev\\git\\sd-webui\\log\\images\\test.png";

const imagesPath = "D:\\dev\\git\\outputs_old_000\\txt2img-images";
import { readdirSync } from "fs";
const images = readdirSync(imagesPath);
console.log(images);

// const imageData = await getImageObject(imageRoute);
// console.log(imageData);

