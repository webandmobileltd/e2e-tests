import { findVideos } from '../../setup/api/videoApi';
import {
  SELECTED_VIDEOS_TEST_PASSWORD,
  SELECTED_VIDEOS_TEST_USERNAME,
} from '../../setup/Constants';
import { generateToken } from '../../setup/generateToken';

context('Video Contracts', () => {
  it('Available videos are limited to contracted ones only', async () => {
    await generateToken(
      SELECTED_VIDEOS_TEST_USERNAME,
      SELECTED_VIDEOS_TEST_PASSWORD,
    )
      .then(async (freshToken: string) =>
        findVideos('Minute Physics', freshToken),
      )
      .then(videos => {
        expect(videos.length).to.equal(1);
      });
  });
});
