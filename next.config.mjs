/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "onnxruntime-node": "commonjs onnxruntime-node",
    });
    return config;
  },
};

export default nextConfig;
