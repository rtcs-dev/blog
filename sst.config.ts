/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "rtcs-blog",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        cloudflare: "5.41.0",
        aws: {
          profile:
            input.stage === "production" ? "rtcs-blog-prod" : "rtcs-blog-dev",
        },
      },
    };
  },
  async run() {
    new sst.aws.Astro("RtcsBlog", {
      domain:
        $app.stage === "production"
          ? {
              name: "rtcs.dev",
              dns: sst.cloudflare.dns(),
            }
          : undefined,
    });
  },
});
