import { AppDataSource } from "./data-source";
import { SelectsService } from "./service/selects2-1.service";

async function main() {
  await AppDataSource.initialize();

  const selectsService = new SelectsService();

  try {
    console.log("2.1.1 - Playlists de um Usuário Específico");
    const playlist = await selectsService.listarPlaylistsPorUsername("Pablo");
    console.log(`\nRESULTADO: ${JSON.stringify(playlist)} \n---------\n`);

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

    console.log("2.3.8 - Musicas com ordem na playlist");
    const musicasEordem =
      await selectsService.listarMusicasComOrdemNaPlaylist();
    console.log(`\nRESULTADO: ${JSON.stringify(musicasEordem)} \n---------\n`);

    console.log(
      "2.3.9 - Busca Invertida: Dono da Playlist que contém 'Bohemian Rhapsody'"
    );
    const dono = await selectsService.buscaPorChaveCompostaInvertida();
    console.log(`\nRESULTADO: ${JSON.stringify(dono)} \n---------\n`);

    console.log("2.4.10 - Rank de Popularidade do Artista");
    const ranking = await selectsService.rankingPopularidadeArtistas();
    console.log(`\nRESULTADO: ${JSON.stringify(ranking)} \n---------\n`);

    console.log("2.4.11 - Desafio Subquery: Led Zeppelin > Top 1 Queen");
    const comparacao = await selectsService.comparaçãoComTop1(
      "Led Zeppelin",
      "Queen"
    );
    console.log(`\nRESULTADO: ${JSON.stringify(comparacao)} \n---------\n`);

    console.log("2.5.12 - Transferência Transacional de Música (Atômica)");
    const resultadoTransacao =
      await selectsService.transferirMusicaAtomicamente(
        1, // usuarioId
        1, // musicaId
        1, // playlistOrigemId
        3 // playlistDestinoId
      );
    console.log(
      `\nRESULTADO: ${JSON.stringify(resultadoTransacao)} \n---------\n`
    );
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
