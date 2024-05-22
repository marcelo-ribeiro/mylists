/** @type {import('next').NextConfig} */
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
});

module.exports = withPWA({
  webpack: (config) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(
              __dirname,
              "node_modules/ionicons/dist/ionicons/svg"
            ),
            to: path.join(__dirname, "public/list/svg"),
          },
        ],
      })
    );
    return config;
  },
});
