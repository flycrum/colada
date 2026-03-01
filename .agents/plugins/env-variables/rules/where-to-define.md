# Where to define

- **Preferred (direnv):** Copy root [.env.example](../../../.env.example) to **.envrc.local** at repo root. `.envrc.local` is gitignored; each developer owns it and it is never committed. Root [.envrc](../../../.envrc) runs `source_env_if_exists .envrc.local` so your local exports load when present. Requires [direnv](https://direnv.net/)
- **Alternative:** Use root `.env` (gitignored); root `.envrc` runs `dotenv` so `.env` is loaded. Same rule: copy from `.env.example`, customize, do not commit
- **Order:** With direnv, `.env` is loaded first (`dotenv`), then `.envrc.local` (if present); so **.envrc.local overrides .env** for the same key
