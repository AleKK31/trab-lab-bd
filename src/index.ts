import { AppDataSource } from "./data-source";
import { ArtistaService } from "./service/artista.service";
import { MusicaService } from "./service/musica.service";
import { PlaylistService } from "./service/playlist.service";
import { UsuarioService } from "./service/usuario.service";

async function main() {
  await AppDataSource.initialize();
  console.log("Database connected!\n");

  const artistaService = new ArtistaService();
  const musicaService = new MusicaService();
  const usuarioService = new UsuarioService();
  const playlistService = new PlaylistService();

  try {
    // Create
    console.log("\n1. Criando artistas");
    const artista1 = await artistaService.criar("Beatles", "Inglaterra");
    console.log("Artista criado:", artista1);

    const artista2 = await artistaService.criar("Legião Urbana", "Brasil");
    console.log("Artista criado:", artista2);

    // Read by ID
    console.log("\n2. Buscando artista por ID");
    const artistaEncontrado = await artistaService.buscarPorId(artista1.id);
    console.log("Artista encontrado:", artistaEncontrado);

    // Update
    console.log("\n3. Atualizando artista");
    const artistaAtualizado = await artistaService.atualizar(artista1.id, {
      nacionalidade: "Reino Unido",
    });
    console.log("Artista atualizado:", artistaAtualizado);

    // Create
    console.log("\n1. Criando músicas");
    const musica1 = await musicaService.criar("Hey Jude", 431, artista1.id);
    console.log("Música criada:", musica1);

    const musica2 = await musicaService.criar("Let It Be", 243, artista1.id);
    console.log("Música criada:", musica2);

    const musica3 = await musicaService.criar(
      "Que País é Este",
      294,
      artista2.id
    );
    console.log("Música criada:", musica3);

    // Read by ID
    console.log("\n2. Buscando música por ID");
    const musicaEncontrada = await musicaService.buscarPorId(musica1.id);
    console.log("Música encontrada:", musicaEncontrada);

    // Update
    console.log("\n3. Atualizando música");
    const musicaAtualizada = await musicaService.atualizar(musica1.id, {
      duracaoSegundos: 430,
    });
    console.log("Música atualizada:", musicaAtualizada);

    // Delete
    console.log("\n4. Deletando música");
    const musica4 = await musicaService.criar("Teste Delete", 180, artista1.id);
    const deletado = await musicaService.deletar(musica4.id);
    console.log("Música deletada:", deletado);

    // Criação de USUARIO
    console.log("\n\n=== CRIANDO USUÁRIO ===");
    const usuario = await usuarioService.criar(
      "teste user",
      "testeuser@email.com"
    );
    console.log("Usuário criado:", usuario);

    // Criação de PLAYLIST
    console.log("\n\n=== CRIANDO PLAYLIST ===");
    const playlist = await playlistService.criarPlaylist(
      usuario.id,
      "Clássicos do teste user"
    );
    console.log("Playlist criada:", playlist);

    // Gerenciamento N:N - Adicionar músicas à playlist
    console.log("\n\n=== ADICIONANDO MÚSICAS À PLAYLIST ===");

    console.log("\n1. Adicionando 'Hey Jude'");
    const mp1 = await playlistService.adicionarMusica(
      musica1.id,
      playlist.playlistId,
      usuario.id
    );
    console.log("Música adicionada:", mp1);

    console.log("\n2. Adicionando 'Let It Be'");
    const mp2 = await playlistService.adicionarMusica(
      musica2.id,
      playlist.playlistId,
      usuario.id
    );
    console.log("Música adicionada:", mp2);

    console.log("\n3. Adicionando 'Que País é Este'");
    const mp3 = await playlistService.adicionarMusica(
      musica3.id,
      playlist.playlistId,
      usuario.id
    );
    console.log("Música adicionada:", mp3);

    // Listar músicas da playlist
    console.log("\n\n=== MÚSICAS NA PLAYLIST ===");
    const musicasDaPlaylist = await playlistService.buscarMusicasDaPlaylist(
      playlist.playlistId,
      usuario.id
    );
    console.log(`\nPlaylist: "${playlist.nome}"`);
    musicasDaPlaylist.forEach((mp) => {
      console.log(
        `${mp.ordemNaPlaylist}. ${mp.musica.titulo} - ${mp.musica.artista.nome} (${mp.musica.duracaoSegundos}s)`
      );
    });

    // Gerenciamento N:N - Remover música da playlist
    console.log("\n\n=== REMOVENDO MÚSICA DA PLAYLIST ===");
    const removido = await playlistService.removerMusica(
      musica2.id,
      playlist.playlistId,
      usuario.id
    );
    console.log("Música 'Let It Be' removida:", removido);

    console.log("\n=== MÚSICAS NA PLAYLIST APÓS REMOÇÃO ===");
    const musicasAposRemocao = await playlistService.buscarMusicasDaPlaylist(
      playlist.playlistId,
      usuario.id
    );
    console.log(`\nPlaylist: "${playlist.nome}"`);
    musicasAposRemocao.forEach((mp) => {
      console.log(
        `${mp.ordemNaPlaylist}. ${mp.musica.titulo} - ${mp.musica.artista.nome} (${mp.musica.duracaoSegundos}s)`
      );
    });

    console.log("\n\nTodas as operações foram concluídas com sucesso!");
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
