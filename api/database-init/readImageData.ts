import { exec } from 'child_process';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const findImageData = (imageData) => {
  const regexTimeModified = /File\sModification\sDate\/Time\s*:\s(.*)/gm;
  const matchesTimeModified = regexTimeModified.exec(imageData);
  const modifiedTime =
    matchesTimeModified?.[0]
      .replace(/File\sModification\sDate\/Time\s*:\s/g, '')
      .trim() || imageData;

  const regexParameters = /Parameters\s*:\s(.*)/gm;
  const matchesParameters = regexParameters.exec(imageData);
  const parameters =
    matchesParameters?.[0].replace(/Parameters\s*:\s/g, '').trim() || imageData;

  return [parameters, modifiedTime];
};

const modelHashes = {
  '1.5-emaonly': '81761151',
  '1.5-inpainting': '3e16efc8',
  '1.4': '7460a6fa',
  'bryanwd-person': 'da781e47',
  '1.5-pruned': 'a9263745',
};

const imageDataToObject = (imageData, imageRoute) => {
  const parsedImageData = imageData.trim();
  const imageObject = {} as Record<string, unknown>;

  const prompt = /^(.*)(Negative\sprompt:|Steps:)/gm
    .exec(parsedImageData)?.[0]
    .replace(/(\.Negative\sprompt:|\.Steps:)/g, '');

  const negativePrompt = /Negative\sprompt:(.*)\r?\n/gm
    .exec(parsedImageData)?.[0]
    .replace(/\r?\n/g, '')
    .replace('Negative prompt:', '')
    .trim();

  const steps = /Steps:([^,]+)/gm
    .exec(parsedImageData)?.[0]
    .replace('Steps:', '')
    .trim();

  const sampler = /Sampler:([^,]+)/gm
    .exec(parsedImageData)?.[0]
    .replace('Sampler:', '')
    .trim();

  const cfg = /CFG scale:([^,]+)/gm
    .exec(parsedImageData)?.[0]
    .replace('CFG scale:', '')
    .trim();

  const seed = /Seed:([^,]+)/gm
    .exec(parsedImageData)?.[0]
    .replace('Seed:', '')
    .trim();

  const size =
    /Size:([^,]+)/gm.exec(parsedImageData)?.[0].replace('Size:', '').trim() ||
    '';
  const width = size.split('x')?.[0];
  const height = size.split('x')?.[1];

  const modelHash = /Model hash:([^,]+)/gm
    .exec(parsedImageData)?.[0]
    .replace('Model hash:', '')
    .trim();
  const model = Object.keys(modelHashes).find(
    (key) => modelHashes[key] === modelHash,
  );

  const denoising = /Denoising strength:([^,]+)/gm
    .exec(parsedImageData)?.[0]
    .replace('Denoising strength:', '')
    .trim();

  const firstPass = /First pass size:([^,]+)/gm
    .exec(parsedImageData)?.[0]
    .replace('First pass size:', '')
    .trim();

  const faceRestoration = /Face restoration:([^,]+)/gm
    .exec(parsedImageData)?.[0]
    .replace('Face restoration:', '')
    .trim();

  imageObject['filename'] = imageRoute.split('/').pop();
  imageObject['number'] = `${imageObject['filename']}`.substring(0, 5);
  imageObject['prompt'] = prompt || null;
  imageObject['negativePrompt'] = negativePrompt || null;

  imageObject['steps'] = steps ? parseFloat(steps) : null;
  imageObject['sampler'] = sampler || null;
  imageObject['cfg'] = cfg ? parseFloat(cfg) : null;
  imageObject['seed'] = seed || null;
  imageObject['width'] = width ? parseInt(width) : null;
  imageObject['height'] = height ? parseInt(height) : null;
  imageObject['modelHash'] = modelHash || null;
  imageObject['model'] = model || null;
  imageObject['denoisingHr'] = denoising ? parseFloat(denoising) : null;
  imageObject['firstPassHr'] = firstPass || null;
  imageObject['faceRestoration'] = faceRestoration || null;
  imageObject['rawParameters'] = parsedImageData || imageData;
  return imageObject;
};

const getImageData = async (imageRoute): Promise<string[]> => {
  if (!imageRoute.includes('.png')) {
    throw new Error('Image route must be a png file, was: ' + imageRoute);
  }
  const effixComand = `exiftool "${imageRoute}"`;
  return new Promise((resolve, reject) => {
    exec(effixComand, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      }
      const rawText = stdout;
      const [greppedText, modifiedTime] = findImageData(rawText);
      resolve([greppedText || rawText, modifiedTime]);
    });
  });
};

const getImageObject = async (imageRoute) => {
  const [imageData, modifiedTime] = await getImageData(imageRoute);
  const imageObject = imageDataToObject(imageData, imageRoute);
  imageObject['modifiedTime'] = modifiedTime
    .replace(/:/, '-')
    .replace(/:/, '-');

  return imageObject;
};

//----------------------------------
// (async () => {
//   const cats = await prisma.imageObject.findMany({
//     where: {
//       prompt: {
//         contains: 'cat',
//       },
//     },
//   });
//   console.log(cats);
// })();
//----------------------------------

const imagesPath =
  '/home/bryan-ub/DEV/MULTIMEDIA/AI generated/Volumes/outputs_old_000/txt2img-images';
// const imagesPath = "D:\\dev\\git\\sd-webui\\log\\images\\";

import { readdirSync, readFileSync, statSync } from 'fs';
const images = readdirSync(imagesPath);
const imagesRoutes = images.map((image) => `${imagesPath}/${image}`);

console.log(`Processing ${imagesRoutes.length} images -->`);
console.time('Processing images');
let i = 0;
(async () => {
  for await (const imageRoute of imagesRoutes) {
    console.time(`Image ${i}`);
    console.log('---------------------');
    const percentCompleted = ((i / imagesRoutes.length) * 100).toFixed(2);
    console.log(
      `Processing image: ${i}/${imagesRoutes.length} - ${percentCompleted}%`,
    );
    console.log(imageRoute);
    console.log('---------------------');
    const imageObject = await getImageObject(imageRoute);
    console.log(imageObject);
    const imageBuffer = readFileSync(imageRoute);
    const { size } = statSync(imageRoute);
    imageObject['imageFile'] = imageBuffer;
    imageObject['imageSize'] = size;

    await prisma.imageObject.create({
      data: {
        fileName: imageObject['filename'] as string,
        number: imageObject['number'] as string,
        prompt: imageObject['prompt'] as string,
        negativePrompt: imageObject['negativePrompt'] as string,
        steps: imageObject['steps'] as number,
        sampler: imageObject['sampler'] as string,
        cfg: imageObject['cfg'] as number,
        seed: imageObject['seed'] as string,
        width: imageObject['width'] as number,
        height: imageObject['height'] as number,
        modelHash: imageObject['modelHash'] as string,
        model: imageObject['model'] as string,
        denoisingHr: imageObject['denoisingHr'] as number,
        firstPassHr: imageObject['firstPassHr'] as string,
        faceRestoration: imageObject['faceRestoration'] as string,
        rawParameters: imageObject['rawParameters'] as string,
        generatedAt: new Date(imageObject['modifiedTime'] as string),
        imageFile: imageBuffer,
        imageSize: size,
      },
    });
    console.timeEnd(`Image ${i}`);
    i++;
  }
  console.timeEnd('Processing images');
})();
