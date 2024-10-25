# rtcs.dev

<a href ="https://rtcs.dev" target="_blank">
  <img src="public/assets/logo/orange-1200x1200.png" width="200" height="200" alt="rtcs logo" />
</a>

This repository contains the source code for the [rtcs blog](https://rtcs.dev).

It is built using Astro, Tailwind CSS, and MDX. The blog is deployed on AWS using SST.

## Directory Structure

The `src` directory contains the following structure:

- `pages`: for the pages, as enforced by Astro.
- `content`: all of the content, authored using MDX.
- `components`: both re-usable and page specific components.
- `layouts`: different page layout components.
- `styles`: CSS files.
- `icons`: SVG assets for `astro-icon`.
- `lib`: business logic, constants (that don't belong in content collections) and schemas.

## Getting Started

### Preliminaries for local development

- `node` (version 20 or latest recommended)
- `pnpm`
- `sst` (v3) - only if you want to deploy it using SST.

Clone the repository, install the dependencies, and make it yours!

## Deployment using SST

- Follow the guide at https://sst.dev/docs/iam-credentials/ to set up IAM credentials locally for AWS.
- Make sure you have a cloudflare account + API token
  - To quickly create one go [here](https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22dns%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22memberships%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22user_details%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_r2%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_routes%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_tail%22%2C%22type%22%3A%22read%22%7D%5D&name=sst&accountId=*&zoneId=all)
- Copy the contents of `.env.sample` into a `.env` file or set them directly from the command line.
- Run `sst deploy` (while setting the right stage according to your needs)
  - development deployments don't use cloudflare at the moment

> NOTE: The Cloudflare setup can be avoided by using Route 53 for DNS and hosting all resources on AWS.
