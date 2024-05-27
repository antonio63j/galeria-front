
export const env = {
    protocol: 'https',
    domain: 'fernandezlucena.es',
    app: 'galeria.'
};

export const environment = {
    production: true,

    urlMetaRestaurante: 'https://metagaleria.ajamam.es',
    serverSsrPort: 8074,
    domain: `${env.domain}`,
    domainUrl: `${env.protocol}://${env.app}${env.domain}`,
    urlEndPoint: `${env.protocol}://${env.app}${env.domain}:8084`,
    googleAnalyticsId: '8SCFLYHJBQ'
};
