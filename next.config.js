module.exports = {
  output: 'export',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  }
};