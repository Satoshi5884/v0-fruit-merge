/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // リポジトリ名がベースパスになる場合は、以下をコメント解除してリポジトリ名を設定
  // basePath: '/your-repo-name',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
