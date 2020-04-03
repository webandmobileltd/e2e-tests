export interface AgeRangeFixture {
  id: string;
  label: string;
  min: number;
  max?: number;
}

export const ageRangeFixtures: AgeRangeFixture[] = [
  { id: 'oneToThree', label: '1-3', min: 1, max: 3 },
  { id: 'threeToFive', label: '3-5', min: 3, max: 5 },
  { id: 'fiveToNine', label: '5-9', min: 5, max: 9 },
];
