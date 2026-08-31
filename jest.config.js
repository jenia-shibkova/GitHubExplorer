module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/features/repos/components/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|@shopify/flash-list)',
  ],
};
