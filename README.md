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
- `build:web`:
  1. compila TypeScript
  2. copia `styles/ui.css` para `dist/styles/ui.css`
  3. gera `dist/index.html` com o caminho correto para `./app/main.js`

### Configuração recomendada no painel da Vercel
- Framework Preset: **Other**
- Build Command: **(deixar vazio, usa `vercel.json`)**
- Output Directory: **(deixar vazio, usa `vercel.json`)**
