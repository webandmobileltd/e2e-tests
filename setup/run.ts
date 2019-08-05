import { getDisciplines, insertDiscipline } from './api/disciplineApi';
import { getSubjects, insertSubject } from './api/subjectApi';
import { getTags, insertTag } from './api/tagApi';
import { findVideos, insertVideo } from './api/videoApi';
import { OPERATOR_PASSWORD, OPERATOR_USERNAME, TOKEN_URL } from './Constants';
import { getParametrisedVideoFixtures } from './fixture/videos';
import { generateToken } from './generateToken';

import {
  addVideoToCollection,
  findOneCollectionId,
  getCollections,
  insertCollection,
} from './api/collectionApi';

import { insertContentPartner } from './api/contentPartnerApi';
import {
  CollectionFixture,
  collectionFixtures,
  ltiCollectionFixture,
} from './fixture/collections';
import { contentPartnerFixtures } from './fixture/contentPartners';
import { disciplineFixtures } from './fixture/disciplines';
import { subjectFixtures } from './fixture/subjects';
import { tagFixtures } from './fixture/tags';

if (!TOKEN_URL || !OPERATOR_USERNAME || !OPERATOR_PASSWORD) {
  throw new Error('Environment variables not set properly.');
}

async function insertVideos(token: string) {
  const allInterpolatedVideos = await getParametrisedVideoFixtures(token);
  console.log('Inserting all videos...');
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
      insertCollection(collection, token),
    ),
  );
  await insertLtiCollection(token);
}

async function insertLtiCollection(token: string) {
  await insertCollection(ltiCollectionFixture, token);
  const ltiCollectionId = await findOneCollectionId(
    ltiCollectionFixture.title,
    token,
  );
  return findVideos('Minute Physics', token).then(videos => {
    return Promise.all(
      videos.map(video =>
        addVideoToCollection(ltiCollectionId, video.id, token),
      ),
    );
  });
}

async function insertContentPartners(token: string) {
  console.log('Inserting content partners...');
  await Promise.all(
    contentPartnerFixtures.map(contentPartnerFixture => {
      insertContentPartner(
        {
          name: contentPartnerFixture.name,
          distributionMethods: contentPartnerFixture.distributionMethods,
          accreditedToYtChannelId:
            contentPartnerFixture.accreditedToYtChannelId,
        },
        token,
      );
    }),
  );
}

async function setUp() {
  const token = await generateToken();

  const subjects = await getSubjects();
  if (!subjects) {
    await insertSubjects(token);
  } else {
    console.log('Subjects already exist, did not update');
  }

  const tags = await getTags();
  if (!tags) {
    await insertTags(token);
  } else {
    console.log('Tags already exist, did not update tags');
  }

  const disciplines = await getDisciplines(token);
  if (!disciplines) {
    await insertDisciplines(token);
  } else {
    console.log('Disciplines already exist, did not update');
  }

  // const contentPartners = await getContentPartners(token);
  // if (!contentPartners) {
  await insertContentPartners(token);
  // } else {
  //   console.log('Content partners already exist, did not update', contentPartners);
  // }

  await insertVideos(token);

  const collections = await getCollections(token);
  if (!collections) {
    await insertCollections(token);
  } else {
    console.log('Collections already exist, did not update');
  }
}

setUp().then(() => {
  console.log('Setup finished');
  process.exit();
});
