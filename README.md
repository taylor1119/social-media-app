# <img src="./apps/web/public/logo.png" width="24"/> Social Media App

Social Media App is a fullstack web app with instant messing, posts and friends lists

<p align="center">
    <img src="https://raw.githubusercontent.com/riyadh-dev/portfolio-website-react/main/public/images/social-media-app/2.png" width="90%"/>
<p>

**Live preview:**

-   [Railway](https://social-media-app-production.up.railway.app)
-   [Render](https://social-media-app-eoga.onrender.com)

## Installation

Use the package manager [yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable) project dependencies.

```bash
yarn
```

You also need a running local instance of mongodb server, or if you are using a remote instance change the **MONGODB_URI** in .env.development

`.env.development`

```.env
MONGODB_URI=<past your uri here>
```

## Usage

```bash
# start dev backend server
yarn server start:dev

# start dev backend server with debugging
yarn server start:debug

# start dev client server
yarn client start
```

You can check other scripts in `package.json` of the root repo and each package
