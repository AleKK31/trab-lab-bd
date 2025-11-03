import { AppDataSource } from "./data-source";
import { ArtistaService } from "./service/artista.service";
import { MusicaService } from "./service/musica.service";
import { PlaylistService } from "./service/playlist.service";
import { UsuarioService } from "./service/usuario.service";

async function testarOperacoes() {
  await AppDataSource.initialize();
  console.log("✅ Conectado ao banco de dados\n");

  const artistaService = new ArtistaService();
  const musicaService = new MusicaService();
  const usuarioService = new UsuarioService();
  const playlistService = new PlaylistService();

  try {
    // Teste 1: CRUD Artista
    console.log("📝 Teste 1: CRUD de Artista");
    const artista = await artistaService.criar("Artista Teste", "Brasil");
    console.log(`✅ Criado: ${artista.nome}`);

    const artistaBuscado = await artistaService.buscarPorId(artista.id);
    console.log(`✅ Encontrado: ${artistaBuscado?.nome}`);

    const artistaAtualizado = await artistaService.atualizar(artista.id, {
      nacionalidade: "Portugal",
    });
    console.log(`✅ Atualizado: ${artistaAtualizado?.nacionalidade}`);

    // Teste 2: CRUD Música
    console.log("\n📝 Teste 2: CRUD de Música");
    const musica = await musicaService.criar("Música Teste", 180, artista.id);
    console.log(`✅ Criada: ${musica.titulo}`);

    const musicaBuscada = await musicaService.buscarPorId(musica.id);
    console.log(
      `✅ Encontrada: ${musicaBuscada?.titulo} por ${musicaBuscada?.artista.nome}`
    );

    const musicaAtualizada = await musicaService.atualizar(musica.id, {
      duracaoSegundos: 200,
    });
    console.log(`✅ Atualizada: duração ${musicaAtualizada?.duracaoSegundos}s`);

    // Teste 3: Criar Usuário e Playlist
    console.log("\n📝 Teste 3: Criação de Playlist");
    const usuario = await usuarioService.criar(
      "Alexandre",
      "alexandre@test.com"
    );
    console.log(`✅ Usuário criado: ${usuario.username}`);

    const playlist = await playlistService.criarPlaylist(
      usuario.id,
      "Clássicos do Alexandre"
    );
    console.log(`✅ Playlist criada: ${playlist.nome}`);

    // Teste 4: Adicionar música à playlist
    console.log("\n📝 Teste 4: Adicionar música à playlist");
    await playlistService.adicionarMusica(
      musica.id,
      playlist.playlistId,
      usuario.id
    );
    console.log(`✅ Música adicionada à playlist`);

    const musicasNaPlaylist = await playlistService.buscarMusicasDaPlaylist(
      playlist.playlistId,
      usuario.id
    );
    console.log(`✅ Playlist tem ${musicasNaPlaylist.length} música(s)`);

    // Teste 5: Remover música da playlist
    console.log("\n📝 Teste 5: Remover música da playlist");
    const removido = await playlistService.removerMusica(
      musica.id,
      playlist.playlistId,
      usuario.id
    );
    console.log(`✅ Música removida: ${removido}`);

    const musicasAposRemocao = await playlistService.buscarMusicasDaPlaylist(
      playlist.playlistId,
      usuario.id
    );
    console.log(`✅ Playlist agora tem ${musicasAposRemocao.length} música(s)`);

    // Teste 6: Deletar música
    console.log("\n📝 Teste 6: Deletar música");
    const deletado = await musicaService.deletar(musica.id);
    console.log(`✅ Música deletada: ${deletado}`);

    console.log("\n✨ Todos os testes passaram com sucesso!");
  } catch (error) {
    console.error("\n❌ Erro durante os testes:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

testarOperacoes();
