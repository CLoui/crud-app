module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: [
      '@testing-library/jest-native/extend-expect',
      '@react-native-async-storage/async-storage/jest/async-storage-mock',
    ],
    transformIgnorePatterns: [
      'node_modules/(?!(react-native|@react-native|expo|@expo|@react-native-community|@expo-google-fonts)/)',
    ],
  };