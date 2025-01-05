module.exports = {
  apps: [
    {
      name: "dpgp-strapi",
      cwd: "/data/dpgp-techart-school/backend_strapi",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "dlus-bot",
      cwd: "/data/dpgp-techart-school/dlus_js",
      script: "npm",
      args: "run dev",
    },
  ],
};
