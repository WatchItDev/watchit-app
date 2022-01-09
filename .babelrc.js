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
            '@babel/preset-react'
        ],
        plugins: [
            [
                require.resolve('babel-plugin-named-asset-import'),
                {
                    loaderMap: {
                        svg: {
                            ReactComponent:
                                '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                        },
                    },
                },
            ]
        ]
    };
};
