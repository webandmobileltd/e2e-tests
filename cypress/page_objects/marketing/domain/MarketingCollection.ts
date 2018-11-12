import Video from '../../domain/Video';

export default interface MarketingCollection {
  title: string;
  description: string;
  videos: Video[];
}
