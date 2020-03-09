import fetch from 'node-fetch';
import { API_URL } from '../Constants';
import { ContentPackageFixture } from '../fixture/contentPackage';
import { assertApiResourceCreation, extractIdFromLocation } from './utilities';

export async function createContentPackage(
  contentPackageFixture: ContentPackageFixture,
  token: string,
) {
  const response = await fetch(`${API_URL}/v1/content-packages`, {
    method: 'POST',
    body: JSON.stringify(contentPackageFixture),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  await assertApiResourceCreation(response, 'ContentPackage fixture creation');
  return extractIdFromLocation(response);
}
