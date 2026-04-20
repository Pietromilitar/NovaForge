# NovaForge Engine

## Deploy na Vercel

### Build local
```bash
npm run build:web
```

### O que a Vercel usa
- `vercel.json` define:
  - `buildCommand`: `npm run vercel-build`
  - `outputDirectory`: `dist`
- `npm run vercel-build` executa `npm run build:web`
- `build:web` (script Node em `scripts/build-web.mjs`):
  1. compila TypeScript
  2. copia `styles/ui.css` para `dist/styles/ui.css`
  3. gera `dist/index.html` com o caminho correto para `./app/main.js`

### Nota sobre erro 127
Se o deploy retornava `127`, geralmente era por dependência de comandos shell (`rm`, `cp`, `sed`) indisponíveis no ambiente.
Agora o build foi migrado para script Node para evitar esse problema.

### Configuração recomendada no painel da Vercel
- Framework Preset: **Other**
- Build Command: **(deixar vazio, usa `vercel.json`)**
- Output Directory: **(deixar vazio, usa `vercel.json`)**
