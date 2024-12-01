import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';

import { calculateSimilarityScore, calculateTotalDistance } from './day-1';

describe('Day 1: Historian Hysteria', () => {
  const locationIdListsFilePath = path.join(__dirname, 'location-id-lists.txt');

  it('Part 1: should calculate total distance', async () => {
    const expectedTotalDistance = 1873376; // Verified for this dataset

    const calculatedTotalDistance = await calculateTotalDistance(locationIdListsFilePath);

    assert.strictEqual(calculatedTotalDistance, expectedTotalDistance);
  });

  it('Part 2: should calculate similarity score', async () => {
    const expectedSimilarityScore = 18997088; // Verified for this dataset

    const calculatedTotalDistance = await calculateSimilarityScore(locationIdListsFilePath);

    assert.strictEqual(calculatedTotalDistance, expectedSimilarityScore);
  });
});
