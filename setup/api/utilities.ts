import { Response } from 'node-fetch';

export function extractIdFromSelfUri(uriString: string): string {
  return uriString.substring(uriString.lastIndexOf('/') + 1);
}

export function extractIdFromLocation(response: Response): string {
  const locationHeaderValue = response.headers.get('Location');
  if (!locationHeaderValue) {
    throw new Error('Unable to retrieve Location header value');
  }

  return extractIdFromSelfUri(locationHeaderValue);
}

export function assertCreateSucceeded(item: string, response: Response) {
  if (response.status === 201) {
    console.log(`${item} created successfully`);
  } else {
    throw new Error(`${item} creation failed with status ${response.status}`);
  }
}
