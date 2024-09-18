/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/dash",
        destination: "/dash/docustreams",
        permanent: true,
      },
      {
        source: "/",
        destination: "/dash/docustreams",
        permanent: true,
      },
      {
        source: "/test/unauthorized-working",
        destination: "/dash/unauthorized",
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.kreativeusa.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "docuvet-cdn.kreativeusa.com.s3-website-us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      }
    ],
  },
  transpilePackages: ["jotai-devtools"],
};

module.exports = nextConfig;
