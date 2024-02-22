/** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = nextConfig;

module.exports = {
    experimental: {
        serverActions: {
            allowedOrigins: [
                "localhost:3000",
                "portfolio-frontend-e7of7w5qiq-uk.a.run.app",
                "portfolio.ajaypradeep.com"
              ]
        },
    },
}

