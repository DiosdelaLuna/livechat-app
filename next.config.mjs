/** @type {import('next').NextConfig} */
<<<<<<< Updated upstream
const nextConfig = {};
=======
const nextConfig = {
  experimental: {
    appDir: true,
    swcPlugins: [["next-superjson-plugin", {}]],
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },
};
>>>>>>> Stashed changes

export default nextConfig;
