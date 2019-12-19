import {
  findContractByName,
  SelectedVideosContract,
} from '../../setup/api/contractApi';
import { findVideos } from '../../setup/api/videoApi';
import {
  SELECTED_VIDEOS_TEST_PASSWORD,
  SELECTED_VIDEOS_TEST_USERNAME,
} from '../../setup/Constants';
import { SELECTED_VIDEOS_CONTRACT_NAME } from '../../setup/fixture/contract';
import { generateToken } from '../../setup/generateToken';

context('Video Contracts', () => {
  it('Available videos are limited to contracted ones only', async () => {
    const token = await generateToken(
      SELECTED_VIDEOS_TEST_USERNAME,
      SELECTED_VIDEOS_TEST_PASSWORD,
    );
    const contract = (await findContractByName(
      SELECTED_VIDEOS_CONTRACT_NAME,
      token,
    )) as SelectedVideosContract;
    const videos = await findVideos('Minute Physics', token);
    expect(videos.map(it => it.id)).to.deep.equal(contract.videoIds);
  });
});
