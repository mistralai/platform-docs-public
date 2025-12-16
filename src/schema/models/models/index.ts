import { defineModels } from '../schema';
import mistralLarge32512 from './mistral-large-3-25-12';
import mistralMedium312508 from './mistral-medium-3-1-25-08';
import mistralSmall322506 from './mistral-small-3-2-25-06';
import ocr2505 from './ocr-25-05';
import voxtralMiniTranscribe2507 from './voxtral-mini-transcribe-25-07';
import codestral2508 from './codestral-25-08';
import devstral22512 from './devstral-2-25-12';
import magistralMedium112507 from './magistral-medium-1-1-25-07';
import codestralEmbed2505 from './codestral-embed-25-05';
import mistralSmallCreative2512 from './mistral-small-creative-25-12';
import devstralSmall22512 from './devstral-small-2-25-12';
import ministral314b2512 from './ministral-3-14b-25-12';
import ministral38b2512 from './ministral-3-8b-25-12';
import ministral33b2512 from './ministral-3-3b-25-12';
import magistralMedium122509 from './magistral-medium-1-2-25-09';
import magistralSmall122509 from './magistral-small-1-2-25-09';
import magistralSmall112507 from './magistral-small-1-1-25-07';
import voxtralMini2507 from './voxtral-mini-25-07';
import voxtralSmall2507 from './voxtral-small-25-07';
import devstralMedium102507 from './devstral-medium-1-0-25-07';
import devstralSmall112507 from './devstral-small-1-1-25-07';
import magistralMedium102506 from './magistral-medium-1-0-25-06';
import magistralSmall102506 from './magistral-small-1-0-25-06';
import devstralSmall102505 from './devstral-small-1-0-25-05';
import mistralMedium32505 from './mistral-medium-3-25-05';
import mistralSmall312503 from './mistral-small-3-1-25-03';
import ocr2503 from './ocr-25-03';
import mistralSaba2502 from './mistral-saba-25-02';
import mistralSmall302501 from './mistral-small-3-0-25-01';
import codestral2501 from './codestral-25-01';
import mistralLarge212411 from './mistral-large-2-1-24-11';
import pixtralLarge2411 from './pixtral-large-24-11';
import mistralModeration2411 from './mistral-moderation-24-11';
import ministral3b241 from './ministral-3b-24-1';
import ministral8b241 from './ministral-8b-24-1';
import mistralSmall202409 from './mistral-small-2-0-24-09';
import pixtral12b2409 from './pixtral-12b-24-09';
import mistralLarge202407 from './mistral-large-2-0-24-07';
import mistralNemo12b2407 from './mistral-nemo-12b-24-07';
import codestralMamba7b01 from './codestral-mamba-7b-0-1';
import mathstral7b01 from './mathstral-7b-0-1';
import codestral2405 from './codestral-24-05';
import mistral7b03 from './mistral-7b-0-3';
import mixtral8x22b0103 from './mixtral-8x22b-0-1-0-3';
import mistralSmall102402 from './mistral-small-1-0-24-02';
import mistralLarge102402 from './mistral-large-1-0-24-02';
import mistralNext from './mistral-next';
import mistralEmbed2312 from './mistral-embed-23-12';
import mistralMedium102312 from './mistral-medium-1-0-23-12';
import mixtral8x7b01 from './mixtral-8x7b-0-1';
import mistral7b02 from './mistral-7b-0-2';
import mistral7b01 from './mistral-7b-0-1';
export const MODELS = defineModels([
  mistralLarge32512,
  mistralMedium312508,
  mistralSmall322506,
  ocr2505,
  voxtralMiniTranscribe2507,
  codestral2508,
  devstral22512,
  magistralMedium112507,
  codestralEmbed2505,
  mistralSmallCreative2512,
  devstralSmall22512,
  ministral314b2512,
  ministral38b2512,
  ministral33b2512,
  magistralMedium122509,
  magistralSmall122509,
  magistralSmall112507,
  voxtralMini2507,
  voxtralSmall2507,
  devstralMedium102507,
  devstralSmall112507,
  magistralMedium102506,
  magistralSmall102506,
  devstralSmall102505,
  mistralMedium32505,
  mistralSmall312503,
  ocr2503,
  mistralSaba2502,
  mistralSmall302501,
  codestral2501,
  mistralLarge212411,
  pixtralLarge2411,
  mistralModeration2411,
  ministral3b241,
  ministral8b241,
  mistralSmall202409,
  pixtral12b2409,
  mistralLarge202407,
  mistralNemo12b2407,
  codestralMamba7b01,
  mathstral7b01,
  codestral2405,
  mistral7b03,
  mixtral8x22b0103,
  mistralSmall102402,
  mistralLarge102402,
  mistralNext,
  mistralEmbed2312,
  mistralMedium102312,
  mixtral8x7b01,
  mistral7b02,
  mistral7b01,
] as const);

const checkDuplicates = (throwError = true) => {
  const set = new Set(MODELS.map(m => m.slug));
  const modelSlugs = MODELS.map(m => m.slug);
  console.log(`${modelSlugs.length} model slugs`);
  console.log(`${set.size} unique model slugs`);
  console.log(`${modelSlugs.length - set.size} duplicate model slugs`);
  if (modelSlugs.length !== set.size) {
    const duplicates = modelSlugs.filter(
      slug => modelSlugs.indexOf(slug) !== modelSlugs.lastIndexOf(slug)
    );
    const setOfDuplicates = Array.from(new Set(duplicates));
    if (throwError) {
      throw new Error(
        '[ERROR] Duplicated model slugs: ' + setOfDuplicates.join(', ')
      );
    }
    console.log('[WARN] Duplicated model slugs: ' + setOfDuplicates.join(', '));
  }
};
checkDuplicates(false);
