// Static images still imported via Vite for optimization
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

// Videos served from /public/videos/ as static assets (not bundled by Vite)
export const BOTTLE_VIDEOS: Record<string, string> = {
  'twilight': '/videos/video-twilight.mp4',
  'horizon': '/videos/video-horizon.mp4',
  'eclipse': '/videos/video-eclipse.mp4',
  'elysium': '/videos/video-elysium.mp4',
  'mirage': '/videos/video-mirage.mp4',
  'oasis': '/videos/video-oasis.mp4',
  'reserve-saffron': '/videos/video-reserve.mp4',
  'sampler-kit': '/videos/video-twilight.mp4',
};
