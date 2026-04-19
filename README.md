# Medical Certificate Issuance System for Acute Episode of Japan Ikitai Syndrome

This is a parody medical-certificate web app built with Next.js + React + daisyUI + Cloudflare Workers via OpenNext.

## Features

- Fill out patient details and notes in an input form
- Live PDF-based certificate preview
- Print-ready A4 certificate output from the browser
- Build scripts included for Cloudflare Workers deployment

## Tech Stack

- Next.js (App Router)
- Tailwind CSS + daisyUI
- Cloudflare Workers (`@opennextjs/cloudflare`)

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run start
```

## Cloudflare Workers (OpenNext)

1. Build command

```bash
npm run preview
```

2. Build output directory

```txt
.open-next/
```

3. Deploy to Cloudflare Workers

```bash
npm run deploy
```

## Disclaimer

This project is a parody sample for humor and fun. It must not be used as a real diagnosis or medical document.

## License

[Menhera Open Source License](LICENSE)


## AI-Generated Code Notice

Parts of this project were created with assistance from AI tools (e.g. large language models). All AI-assisted contributions were reviewed and adapted by maintainers before inclusion. If you need provenance for specific changes, please refer to the Git history and commit messages.
