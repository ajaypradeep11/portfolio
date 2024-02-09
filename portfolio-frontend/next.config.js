/** @type {import('next').NextConfig} */
// const nextConfig = {};

// module.exports = nextConfig;

module.exports = {
    experimental: {
        serverActions: {
            allowedOrigins: ["portfolio-frontend-service-e7of7w5qiq-uk.a.run.app:3000"],
        },
    },
}
