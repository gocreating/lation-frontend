# Lation Frontend

The monorepo for lation frontend.

## Create New App

```
npx create-next-app packages/my-awesome-app
```

## Development

Launch apps

```
yarn --cwd packages/official-site dev
yarn --cwd packages/converter dev
yarn --cwd packages/stock dev
yarn --cwd packages/coin dev
```

Install dependencies

```
yarn workspace @lation/utils add <package-name>
yarn workspace @lation/components add <package-name>
```

## Deploy on Vercel

TBD
