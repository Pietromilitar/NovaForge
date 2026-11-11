export async function importAddon(file) {
  const ext=file.name.toLowerCase().split(".").pop();
  if(!["mcaddon","mcpack","zip"].includes(ext)) throw new Error("Formato não suportado.");
  throw new Error("Importador de pacotes Bedrock ainda em desenvolvimento. O arquivo não foi alterado.");
}
export function exportBedrockWorld() {
  throw new Error("Exportação .mcworld/.mctemplate ainda não está pronta. Não será gerado um arquivo falso.");
}