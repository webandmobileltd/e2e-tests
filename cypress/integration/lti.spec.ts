// @ts-ignore
import { findOneCollectionId } from '../../setup/collectionApi';
// @ts-ignore
import * as instructionalVideos from '../../setup/fixture/instructional_videos';
// @ts-ignore
import * as ltiCollection from '../../setup/fixture/lti_collection';
// @ts-ignore
import * as generateToken from '../../setup/generateToken';
// @ts-ignore
import { findOneVideo } from '../../setup/videoApi';

import { LtiToolConsumerEmulatorPage } from '../page_objects/lti/LtiToolConsumerEmulatorPage';

let token: string;

let videoId: string;
let collectionId: string;

beforeEach(() => {
  return generateToken()
    .then(async (freshToken: string) => {
      token = freshToken;
      const allInstructionalVideos = await instructionalVideos();
      return findOneVideo(allInstructionalVideos[0].title, token);
    })
    .then((returnedVideoId: string) => {
      videoId = returnedVideoId;
    })
    .then(async () => {
      collectionId = await findOneCollectionId(ltiCollection.title, token);
    });
});

context('LTI', () => {
  it('Launching a single video', () => {
    new LtiToolConsumerEmulatorPage()
      .visit()
      .provideLaunchRequestData(`/videos/${videoId}`)
      .saveData()
      .launchToolProvider()
      .hasLoadedBoclipsPlayer();
  });

  it('Launching a collection of videos', () => {
    new LtiToolConsumerEmulatorPage()
      .visit()
      .provideLaunchRequestData(`/collections/${collectionId}`)
      .saveData()
      .launchToolProvider()
      .hasLoadedCollectionsPage()
      .selectFirstVideoTile()
      .hasLoadedBoclipsPlayer();
  });
});
