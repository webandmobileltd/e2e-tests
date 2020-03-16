import {
  ensureAccessRuleAndReturnId,
  findAccessRuleByName,
  IncludedVideosAccessRule,
} from '../../setup/api/accessRuleApi';
import { ensureApiIntegrationAndReturnId } from '../../setup/api/apiIntegrationApi';
import { createContentPackage } from '../../setup/api/contentPackageApi';
import { findVideos } from '../../setup/api/videoApi';
import {
  SELECTED_VIDEOS_TEST_PASSWORD,
  SELECTED_VIDEOS_TEST_USERNAME,
} from '../../setup/Constants';
import {
  INCLUDED_VIDEOS_ACCESS_RULE_NAME,
  includedVideosAccessRuleFixture,
} from '../../setup/fixture/accessRule';
import { includedVideosApiIntegrationFixture } from '../../setup/fixture/apiIntegration';
import { generateToken } from '../../setup/generateToken';

context('Video Access Rules', () => {
  it('Available videos are limited to permitted ones only', async () => {
    const adminToken = await generateToken();
    setupIncludedVideos(adminToken);

    const token = await generateToken(
      SELECTED_VIDEOS_TEST_USERNAME,
      SELECTED_VIDEOS_TEST_PASSWORD,
    );

    const accessRule = (await findAccessRuleByName(
      INCLUDED_VIDEOS_ACCESS_RULE_NAME,
      token,
    )) as IncludedVideosAccessRule;
    const videos = await findVideos('Minute Physics', token);
    expect(videos.map(it => it.id)).to.deep.equal(accessRule.videoIds);
  });
});

async function setupIncludedVideos(token: string) {
  const videos = await findVideos('Minute Physics', token);
  const selectedVideos = [videos[0]];
  const accessRuleId = await ensureAccessRuleAndReturnId(
    includedVideosAccessRuleFixture(selectedVideos.map(video => video.id)),
    token,
  );
  const contentPackageId = await createContentPackage(
    {
      name: 'Included Videos Content Package',
      accessRuleIds: [accessRuleId],
    },
    token,
  );
  await ensureApiIntegrationAndReturnId(
    includedVideosApiIntegrationFixture(contentPackageId),
    token,
  );
}
