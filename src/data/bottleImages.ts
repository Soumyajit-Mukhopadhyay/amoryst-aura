import videoTwilight from '@/assets/video-twilight.mp4';
import videoHorizon from '@/assets/video-horizon.mp4';
import videoEclipse from '@/assets/video-eclipse.mp4';
import videoElysium from '@/assets/video-elysium.mp4';
import videoMirage from '@/assets/video-mirage.mp4';
import videoOasis from '@/assets/video-oasis.mp4';
import videoReserve from '@/assets/video-reserve.mp4';

import bottleTwilight from '@/assets/bottle-twilight.jpg';
import bottleHorizon from '@/assets/bottle-horizon.jpg';
import bottleEclipse from '@/assets/bottle-eclipse.jpg';
import bottleElysium from '@/assets/bottle-elysium.jpg';
import bottleMirage from '@/assets/bottle-mirage.jpg';
import bottleOasis from '@/assets/bottle-oasis.jpg';
import bottleReserve from '@/assets/bottle-reserve.jpg';

export const BOTTLE_IMAGES: Record<string, string> = {
  'twilight': bottleTwilight,
  'horizon': bottleHorizon,
  'eclipse': bottleEclipse,
  'elysium': bottleElysium,
  'mirage': bottleMirage,
  'oasis': bottleOasis,
  'reserve-saffron': bottleReserve,
  'sampler-kit': bottleTwilight,
};

export const BOTTLE_VIDEOS: Record<string, string> = {
  'twilight': videoTwilight,
  'horizon': videoHorizon,
  'eclipse': videoEclipse,
  'elysium': videoElysium,
  'mirage': videoMirage,
  'oasis': videoOasis,
  'reserve-saffron': videoReserve,
  'sampler-kit': videoTwilight,
};
