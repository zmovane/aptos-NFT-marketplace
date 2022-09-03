# Demo NFT marketplace

A full stack demo NFT marketplace based on aptos devnet. Aiming for clean and cocise code that is easy to understand and also make some automations to speed up full stack development.

## Tech stack

- code: Move, Typescript, [Next.js](https://nextjs.org/)
- styles: [tailwindcss](https://tailwindcss.com), [daisyui](https://daisyui.com)

## Development

### Compile move module

```
NAME=<name> ADDRESS=<address> yarn workspace market-contracts move:compile
```

### Publish move module

```
NAME=<name> ADDRESS=<address> yarn workspace market-contracts move:publish
```

### Config .env.local file

In order to expose a variable to the browser you have to prefix the variable with `NEXT_PUBLIC_`

```
NEXT_PUBLIC_NFT_STORAGE_KEY=
NEXT_PUBLIC_NFT_MARKET_ADDRESS=0x64f236ab7ba803a8921c16fa2b9995da51033e3ed2e284e358f0d5431a39c0d0
NEXT_PUBLIC_NFT_MARKET_NAME=_1200_dollars_per_hour

NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com/v1/

NEXT_PUBLIC_WALLET_PRIVATE_KEY=
```

Read more on [https://nextjs.org/docs/basic-features/environment-variables](https://nextjs.org/docs/basic-features/environment-variables)

### Run script for create market

```
NODE_ENV=development yarn workspace market-frontend aptos:create-market
```

### Run dev

```
yarn workspace market-frontend dev
```
