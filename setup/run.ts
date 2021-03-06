import {
  addVideoToCollection,
  ensureCollectionAndReturnId,
  findOneCollectionId,
  insertCollection,
} from './api/collectionApi';

import { ensureAccessRuleAndReturnId } from './api/accessRuleApi';
import { findOneAgeRange, getAgeRanges, insertAgeRange, } from './api/ageRangeApi';
import { ensureApiIntegrationAndReturnId } from './api/apiIntegrationApi';
import { createContentPackage } from './api/contentPackageApi';
import { getContentPartners, insertContentPartner, } from './api/contentPartnerApi';
import { getDisciplines, insertDiscipline } from './api/disciplineApi';
import { getSubjects, insertSubject } from './api/subjectApi';
import { getTags, insertTag } from './api/tagApi';
import { inserting } from './api/utilities';
import { findVideos, insertVideo } from './api/videoApi';
import { OPERATOR_PASSWORD, OPERATOR_USERNAME, TOKEN_URL } from './Constants';
import {
  excludedVideoTypesAccessRuleFixture,
  includedVideosAccessRuleFixture,
  ltiIncludedCollectionsAccessRuleFixture,
} from './fixture/accessRule';
import { ageRangeFixtures } from './fixture/ageRanges';
import { includedVideosApiIntegrationFixture, ltiApiIntegrationFixture, } from './fixture/apiIntegration';
import { CollectionFixture, collectionFixtures, ltiCollectionFixture, } from './fixture/collections';
import { contentPartnerFixtures } from './fixture/contentPartners';
import { disciplineFixtures } from './fixture/disciplines';
import { subjectFixtures } from './fixture/subjects';
import { tagFixtures } from './fixture/tags';
import { getParametrisedVideoFixtures } from './fixture/videos';
import { generateToken } from './generateToken';
import { getContentPartnerContracts, insertContentPartnerContract } from "./api/contentPartnerContractApi";

if (!TOKEN_URL || !OPERATOR_USERNAME || !OPERATOR_PASSWORD) {
  throw new Error('Environment variables not set properly.');
}

async function insertVideos(token: string) {
  const allInterpolatedVideos = await getParametrisedVideoFixtures(token);
  return Promise.all(
    allInterpolatedVideos.map(async video => {
      await insertVideo(video, token);
    }),
  );
}

async function insertSubjects(token: string) {
  return Promise.all(
    subjectFixtures.map(subject => insertSubject(subject, token)),
  );
}

async function insertAgeRanges(token: string) {
  return Promise.all(
    ageRangeFixtures.map(range =>
      findOneAgeRange(range.id, token).then(id => {
        if (id) {
          insertAgeRange(range, token);
        }
      }),
    ),
  );
}

async function insertTags(token: string) {
  return Promise.all(tagFixtures.map(tag => insertTag(tag, token)));
}

async function insertDisciplines(token: string) {
  return Promise.all(
    disciplineFixtures.map(discipline => insertDiscipline(discipline, token)),
  );
}

async function insertCollections(token: string) {
  await Promise.all(
    collectionFixtures.map((collection: CollectionFixture) =>
      findOneCollectionId(collection.title, token).then(id => {
        if (!id) {
          insertCollection(collection, token);
        }
      }),
    ),
  );
}

async function setupLtiFixtures(token: string) {
  const collectionId = await ensureCollectionAndReturnId(
    ltiCollectionFixture,
    token,
  );

  await findVideos('Minute Physics', token).then(videos => {
    return Promise.all(
      videos.map(video => addVideoToCollection(collectionId, video.id, token)),
    );
  });

  const accessRuleId = await ensureAccessRuleAndReturnId(
    ltiIncludedCollectionsAccessRuleFixture([collectionId]),
    token,
  );

  const contentPackageId = await createContentPackage(
    {
      name: 'LTI Content Package',
      accessRuleIds: [accessRuleId],
    },
    token,
  );

  if (contentPackageId) {
    await ensureApiIntegrationAndReturnId(
      ltiApiIntegrationFixture(contentPackageId),
      token,
    );
  }
}

async function setupSelectedVideosE2ETest(token: string) {
  const videos = await findVideos('Minute Physics', token);
  const selectedVideos = [videos[0]];
  const accessRuleId = await ensureAccessRuleAndReturnId(
    includedVideosAccessRuleFixture(selectedVideos.map(video => video.id)),
    token,
  );
  const contentPackageId = await createContentPackage(
    {
      name: 'Selected Videos Content Package',
      accessRuleIds: [accessRuleId],
    },
    token,
  );
  if (contentPackageId) {
    await ensureApiIntegrationAndReturnId(
      includedVideosApiIntegrationFixture(contentPackageId),
      token,
    );
  }
}

async function setupClassroomAccessRule(token: string) {
  const accessRuleId = await ensureAccessRuleAndReturnId(
    excludedVideoTypesAccessRuleFixture(['STOCK'], 'NO STOCK'),
    token,
  );

  await createContentPackage(
    { name: 'Classroom', accessRuleIds: [accessRuleId] },
    token,
  );
}

async function insertContentPartners(token: string) {
  await insertContentPartnerContract(token)
  const contracts = await getContentPartnerContracts(token);

  if (!contracts || !(contracts.length > 0)) {
    throw new Error('Cannot find contracts needed to create channels')
  }

    return Promise.all(
      contentPartnerFixtures.map(async contentPartnerFixture => {
        return insertContentPartner(
          {
            name: contentPartnerFixture.name,
            distributionMethods: contentPartnerFixture.distributionMethods,
            accreditedToYtChannelId:
            contentPartnerFixture.accreditedToYtChannelId,
            currency: contentPartnerFixture.currency,
            contractId: contracts[0].id,
          },
          token,
        );
      }),
    );
}

async function setUp() {
  const token = await generateToken();

  const subjects = await getSubjects();
  if (!subjects || subjects.length === 0) {
    inserting('subjects');
    await insertSubjects(token);
  }

  const ageRanges = await getAgeRanges();
  if (!ageRanges || ageRanges.length === 0) {
    inserting('ageRanges');
    await insertAgeRanges(token);
  }

  const tags = await getTags();
  if (!tags) {
    inserting('tags');
    await insertTags(token);
  }

  const disciplines = await getDisciplines(token);
  if (!disciplines || disciplines.length === 0) {
    inserting('disciplines');
    await insertDisciplines(token);
  }

  const contentPartners = await getContentPartners(token);

  inserting('content partners');
  await insertContentPartners(token);

  inserting('videos');
  await insertVideos(token);

  inserting('collections');
  await insertCollections(token);

  inserting('LTI fixtures');
  await setupLtiFixtures(token);

  inserting('Selected Videos AccessRuleFixture fixtures');
  await setupSelectedVideosE2ETest(token);

  inserting('classroom accesrule fixtures');
  await setupClassroomAccessRule(token);
}

setUp()
  .then(() => {
    console.log('Setup finished');
    process.exit();
  })
  .catch(e => {
    console.log(`Setup failed, ${e}`);
    process.exit(1);
  });
