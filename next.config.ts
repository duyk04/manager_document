import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// // next.config.js
// const path = require('path');

// module.exports = {
//     async rewrites() {
//         return [
//             {
//                 source: '/uploads/:path*',
//                 destination: '/uploads/:path*',
//             },
//         ];
//     },
//     // Cấu hình để Next.js nhận diện các file static
//     webpack(config) {
//         config.resolve.alias['@uploads'] = path.join(__dirname, 'uploads');
//         return config;
//     },
// };

