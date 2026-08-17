// Body-part image map for the Exercise Library.
// The original GitHub dataset's image/gif URLs are dead (the repo removed the
// media folders), so we render a consistent dark-studio image keyed by the
// exercise's body_part instead. Exercises with a working uploaded image
// (media.base44.com / static.wixstatic.com) keep using that.

const BODY_PART_IMAGES = {
  'back': 'https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/d07b49198_generated_image.png',
  'chest': 'https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/ce8426a0b_generated_image.png',
  'shoulders': 'https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/7961a349a_generated_image.png',
  'upper legs': 'https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/414b1693f_generated_image.png',
  'upper arms': 'https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/75fd946ad_generated_image.png',
  'waist': 'https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/8cf03c354_generated_image.png',
  'cardio': 'https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/03605dd2d_generated_image.png',
  'lower arms': 'https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/ef1d2cc96_generated_image.png',
  'lower legs': 'https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/e65cb2689_generated_image.png',
  'neck': 'https://media.base44.com/images/public/6a6d316d80e436e8127c02a4/915bed1a2_generated_image.png',
};

const GENERIC_IMAGE = BODY_PART_IMAGES['chest'];

const WORKING_HOSTS = /media\.base44\.com|static\.wixstatic\.com/;

/**
 * Returns the best image URL for an exercise.
 * Prefers a working uploaded image; otherwise maps by body_part.
 */
export function getExerciseImage(exercise) {
  if (!exercise) return GENERIC_IMAGE;
  const url = exercise.image_url;
  if (url && WORKING_HOSTS.test(url)) return url;
  return BODY_PART_IMAGES[exercise.body_part] || GENERIC_IMAGE;
}

export { BODY_PART_IMAGES, GENERIC_IMAGE };