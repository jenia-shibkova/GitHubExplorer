# GitHubExplorer

A cross-platform (iOS/Android) repo search app built with the **React
Native CLI** (bare workflow) + TypeScript strict mode, for the Senior React
Native take-home assignment.

## How to run

```bash
yarn install

# iOS only, once after install and whenever native deps change
cd ios && bundle install && bundle exec pod install && cd ..

yarn start          # Metro bundler, in one terminal
yarn ios            # or: yarn android, in another terminal
```

```bash
yarn typecheck   # tsc --noEmit
yarn test        # jest unit tests
yarn lint        # eslint
```
