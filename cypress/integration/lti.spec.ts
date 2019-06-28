// @ts-ignore
import * as findOneVideo from '../../setup/findOneVideo';
// @ts-ignore
import * as instructionalVideos from '../../setup/fixture/instructional_videos';
// @ts-ignore
import * as generateToken from '../../setup/generateToken';

import { LtiToolConsumerEmulatorPage } from '../page_objects/lti/LtiToolConsumerEmulatorPage';

let videoId: string;

beforeEach(() => {
  return generateToken()
    .then(async (token: string) => {
      const allInstructionalVideos = await instructionalVideos();
      return findOneVideo(allInstructionalVideos[0].title, token);
    })
    .then((returnedVideoId: string) => {
      videoId = returnedVideoId;
    });
});

context('LTI', () => {
  it('triggering lti launch request', () => {
    new LtiToolConsumerEmulatorPage()
      .visit()
      .provideLaunchRequestData(videoId)
      .saveData()
      .launchToolProvider()
      .hasLoadedBoclipsPlayer();
  });
});
