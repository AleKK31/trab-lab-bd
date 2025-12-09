import { AppDataSource } from "./data-source";
import { SelectsService } from "./service/selects2-1.service";

async function main() {
  await AppDataSource.initialize();

  const selectsService = new SelectsService();

  try {
    console.log("2.1.1 - Playlists de um Usuário Específico");
    const playlist = await selectsService.listarPlaylistsPorUsername("Pablo");
    console.log(`\nRESULTADO: ${JSON.stringify(playlist)} \n---------\n`);

    console.log("2.1.1 - EXEMPLO 2 - Playlists de um Usuário Específico");
    const playlist2 = await selectsService.listarPlaylistsPorUsername2("Pablo");
    console.log(`\nRESULTADO: ${JSON.stringify(playlist2)} \n---------\n`);

    console.log(
      "2.1.2 - Músicas em Playlists de um Artista, criadas por um usuário específico"
    );
    const musicas =
      await selectsService.listarMusicasDePlaylistsPorUsuarioEArtista(
        "Josue",
        "Queen"
      );
    console.log(`\nRESULTADO: ${JSON.stringify(musicas)} \n---------\n`);

    console.log("2.1.3 - Contagem de músicas por playlist (ordem decrescente)");
    const result = await selectsService.listarPlaylistsComContagemDeMusicas();
    console.log(`\nRESULTADO: ${JSON.stringify(result)} \n---------\n`);

    console.log("2.1.4 - Artistas sem músicas em playlists");
    const artistas = await selectsService.listarArtistasSemMusicasEmPlaylists();
    console.log(`\nRESULTADO: ${JSON.stringify(artistas)} \n---------\n`);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
