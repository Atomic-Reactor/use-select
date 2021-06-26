module.exports = api => {
    const isTest = api.env('test');
    if (isTest) {
        return {
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: { node: 'current' },
                    },
                ],
                '@babel/preset-react',
            ],
            plugins: [
                [
                    '@babel/plugin-proposal-class-properties',
                    {
                        loose: true,
                    },
                ],
                ['@babel/plugin-proposal-export-default-from'],
            ],
        };
    }

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    targets: { node: 'current' },
                },
            ],
            '@babel/preset-react',
        ],
        plugins: [
            [
                '@babel/plugin-proposal-class-properties',
                {
                    loose: true,
                },
            ],
            ['@babel/plugin-proposal-export-default-from'],
        ],
    };
};
