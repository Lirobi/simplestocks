module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest'
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(.*?@babel/runtime)/)'
    ],
}; 