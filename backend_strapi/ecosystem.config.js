module.exports = {
  apps: [
    {
      name: 'dpgp-strapi',
      cwd: '/data/dpgp-techart-school/backend_strapi', 
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
