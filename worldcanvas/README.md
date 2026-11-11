# WorldCanvas

Editor de mapas Minecraft Bedrock, com interface em português.

## Desenvolvimento
- Requer Node.js 20 ou superior.
- `npm install`
- `npm run dev`

## Estado atual
Esta é a fundação inicial do editor: canvas 2D com pintura de altura, camadas, salvamento/importação JSON e visualização de relevo em 3D.
A exportação de mundos Bedrock (.mcworld/.mctemplate) e a leitura completa de pacotes .mcaddon/.mcpack ainda precisam ser implementadas e testadas com arquivos reais. O catálogo de blocos precisa ser vinculado a uma versão Bedrock definida; não afirma conter todos os blocos.

## Estrutura
- `src/core`: estado do projeto
- `src/editor`: canvas, camadas e visualização 3D
- `src/io`: importação e exportação
