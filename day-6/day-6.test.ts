import { describe, it } from 'node:test';
import assert from 'node:assert';
import path from 'node:path';

import {
  determineNumberOfDistinctPositionsVisitedByGuard,
  determineNumberOfObstaclePositionsCausingALoop,
  determineNumberOfObstaclePositionsCausingALoopBruteforce,
} from './day-6';

describe('Day 6: Guard Gallivant', () => {
  const mapFilePath = path.join(__dirname, 'map.txt');

  it('Part 1: should determine number of distinct positions visited the guard', async () => {
    const expectedNumberOfDistinctPositionsVisitedByGuard = 5153; // Verified for this dataset

    const numberOfDistinctPositionsVisitedByGuard = await determineNumberOfDistinctPositionsVisitedByGuard(mapFilePath);

    assert.strictEqual(numberOfDistinctPositionsVisitedByGuard, expectedNumberOfDistinctPositionsVisitedByGuard);
  });

  it('Part 2: should determine number of obstacle positions causing a loop', async () => {
    const expectedNumberOfObstaclePositionsCausingALoop = 1711; // Verified for this dataset

    const numberOfObstaclePositionsCausingALoop = await determineNumberOfObstaclePositionsCausingALoop(mapFilePath);

    assert.strictEqual(numberOfObstaclePositionsCausingALoop, expectedNumberOfObstaclePositionsCausingALoop);
  });

  it('Part 2 (bruteforce): should determine number of obstacle positions causing a loop', async () => {
    const expectedNumberOfObstaclePositionsCausingALoop = 1711; // Verified for this dataset

    const numberOfObstaclePositionsCausingALoop = await determineNumberOfObstaclePositionsCausingALoopBruteforce(mapFilePath);

    assert.strictEqual(numberOfObstaclePositionsCausingALoop, expectedNumberOfObstaclePositionsCausingALoop);
  });
});
