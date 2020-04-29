import fetch from 'node-fetch';
import { API_URL } from '../Constants';
import { ContentPackageFixture } from '../fixture/contentPackage';
import { assertApiResourceCreation, extractIdFromLocation } from './utilities';

export async function createContentPackage(
  contentPackageFixture: ContentPackageFixture,
  token: string,
): Promise<string | null> {
  const response = await fetch(`${API_URL}/v1/content-packages`, {
    method: 'POST',
    body: JSON.stringify(contentPackageFixture),
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 409) {
    return null;
  } else {
    await assertApiResourceCreation(
      response,
      'ContentPackage fixture creation',
    );
    return extractIdFromLocation(response);
  }
}
