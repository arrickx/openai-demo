import { search } from './search.js'

describe('search function', () => {
  let results;

  beforeAll(async () => {
    results = await search('airplane movie');
  });

  test('returns an array', () => {
    expect(Array.isArray(results)).toBe(true);
  });

  test('returns expected content', () => {
    expect(results[0][0].pageContent).toBe('Title: Interstellar\nFeatures futuristic space travel with high stakes');
  });
});
