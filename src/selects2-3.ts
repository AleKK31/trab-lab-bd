import { AppDataSource } from "./data-source";
import { SelectsService } from "./service/selects2-1.service";

async function main() {
  await AppDataSource.initialize();

  const selectsService = new SelectsService();

  try {
    console.log("2.3.8 - Musicas com ordem na playlist");
    const musicasEordem =
      await selectsService.listarMusicasComOrdemNaPlaylist();
    console.log(`\nRESULTADO: ${JSON.stringify(musicasEordem)} \n---------\n`);

    console.log(
      "2.3.9 - Busca Invertida: Dono da Playlist que contém 'Bohemian Rhapsody'"
    );
    const dono = await selectsService.buscaPorChaveCompostaInvertida();
    console.log(`\nRESULTADO: ${JSON.stringify(dono)} \n---------\n`);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
