# How the no-comments rule is enforced

- `eslint-plugin-no-comments` checks `.ts` files and the `<script>` of `.vue` files. Its `allow` option falls
  back to its defaults (`eslint` and `global` comments pass) when the list is empty, so the config passes the
  pattern `(?!)`, which never matches, and nothing is exempt.
- `noInlineConfig` is on, so an `eslint-disable` comment can't switch the rule off. Exceptions go in
  `eslint.config.mjs`.
- ESLint doesn't see template comments, so `scripts/check-no-comments.ts` parses every `.vue` file under
  `packages/` and `apps/` with `@vue/compiler-sfc` and fails on any comment node.
- `@atlair/vue` builds with the Vue compiler option `comments: false`, so a comment that slipped past the check
  still wouldn't ship.
- `typescript-eslint` can't use TypeScript 7, so the repo root pins TypeScript 6 for it. Packages keep their
  own TypeScript.
