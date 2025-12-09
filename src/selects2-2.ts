import { AppDataSource } from "./data-source";
import { SelectsService } from "./service/selects2-1.service";

async function main() {
  await AppDataSource.initialize();

  const selectsService = new SelectsService();

  try {
    // Consultas Focadas em Otimização e Detalhe
    console.log("2.2.5 - Detalhes Completos da Música com Artista");
    const musicaComArtisa = await selectsService.listarMusicaComArtista(1);
    console.log(
      `\nRESULTADO: ${JSON.stringify(musicaComArtisa)} \n---------\n`
    );

    console.log("2.2.6 - Duração Total de Reprodução por Playlist");
    const duracao = await selectsService.listarTotalReproducaoPlaylist();
    console.log(`\nRESULTADO: ${JSON.stringify(duracao)} \n---------\n`);

    console.log("2.2.7 - Músicas Mais Curtas que a Média do Artista");
    const musicasCurtas =
      await selectsService.listarMusicasComDuracaoMenorQueMediaDoArtista();
    console.log(`\nRESULTADO: ${JSON.stringify(musicasCurtas)} \n---------\n`);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
