# Where to define

- **Default:** Root [.env](../../../.env) is committed with safe defaults; root [.envrc](../../../.envrc) runs `dotenv` so `.env` is loaded. Do not put secrets in `.env`
- **Overrides (direnv):** Copy root [.env.example](../../../.env.example) to **.envrc.local** at repo root. `.envrc.local` is gitignored; each developer owns it. Root `.envrc` runs `source_env_if_exists .envrc.local` so your exports override `.env`. Requires [direnv](https://direnv.net/)
- **Order:** `.env` is loaded first (`dotenv`), then `.envrc.local` (if present); **.envrc.local overrides .env** for the same key
