import mockData from './savedMockData.json';

// IMPORTANT: This is a frozen snapshot of the live feeds data.
// It is NOT currently used anywhere in the application.
// The user explicitly requested to save this as a backup but never use it unless explicitly instructed.

export const getFrozenMockInsights = () => {
  return mockData;
};
