module.exports = (api) => {
    const mode = process.env.NODE_ENV || 'production';

    // This caches the Babel config by environment.
    api.cache.using(() => mode);

    return {
        presets: [
            ['@babel/preset-env', {
                targets: {
                    esmodules: true
                }
            }],
            ['@babel/preset-react', {
                runtime: 'automatic',
                development: process.env.NODE_ENV === 'development',
                importSource: '@welldone-software/why-did-you-render',
              }]
        ]
    };
};
