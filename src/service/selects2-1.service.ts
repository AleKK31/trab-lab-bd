import { AppDataSource } from "../data-source";
import { ArtistaEntity } from "../entity/artista.entity";
import { MusicaPlaylistEntity } from "../entity/musicaPlaylist.entity";
import { PlaylistEntity } from "../entity/playlist.entity";
import { UsuarioEntity } from "../entity/usuario.entity";

export class SelectsService {
  private playlistRepository = AppDataSource.getRepository(PlaylistEntity);
  private musicaPlaylistRepository =
    AppDataSource.getRepository(MusicaPlaylistEntity);
  private artistasRepository = AppDataSource.getRepository(ArtistaEntity);
  private usuarioRepository = AppDataSource.getRepository(UsuarioEntity);

  async listarPlaylistsPorUsername(username: string) {
    const playlist = await this.playlistRepository
      .createQueryBuilder("playlist")
      .innerJoin("playlist.usuario", "usuario")
      .where("usuario.username = :username", { username })
      .select(["playlist.nome AS nome", "playlist.dataCriacao AS dataCriacao"])
      .getRawMany();

    return playlist;
    // const plasy2 = await this.playlistRepository.find({
    //   where: { usuario: { usemusicaPlaylistRepositoryrname } },
    //   select: ["nome", "dataCriacao"],
    //   relations: ["usuario"],
    // });
    // return plasy2;
  }

  async listarMusicasDePlaylistsPorUsuarioEArtista(
    username: string,
    artistaNome: string
  ) {
    const musicas = await this.musicaPlaylistRepository
      .createQueryBuilder("mp")
      .innerJoin("mp.playlist", "playlist")
      .innerJoin("playlist.usuario", "usuario")
      .innerJoin("mp.musica", "musica")
      .innerJoin("musica.artista", "artista")
      .where("usuario.username = :username", { username })
      .andWhere("artista.nome = :artistaNome", { artistaNome })
      .select([
        "musica.titulo AS titulo",
        "artista.nome AS artista",
        "playlist.nome AS playlist",
      ])
      .getRawMany();

    return musicas;
  }

  async listarPlaylistsComContagemDeMusicas() {
    const result = await this.playlistRepository
      .createQueryBuilder("playlist")
      .leftJoin("playlist.usuario", "usuario")
      .leftJoin(
        "musica_playlist",
        "mp",
        "mp.playlist_id = playlist.playlistId AND mp.usuario_id = playlist.usuarioId"
      )
      .select(["playlist.nome AS nome"])
      .addSelect("COUNT(mp.musica_id)", "totalMusicas")
      .groupBy("playlist.playlistId, playlist.usuarioId, playlist.nome")
      .orderBy("COUNT(mp.musica_id)", "DESC")
      .getRawMany();

    return result;
  }

  async listarArtistasSemMusicasEmPlaylists() {
    return await this.artistasRepository
      .createQueryBuilder("artista")
      .leftJoin("artista.musicas", "musica")
      .leftJoin("musica.musicaPlaylists", "mp")
      .where("mp.musica_id IS NULL")
      .select(["artista.id", "artista.nome"])
      .getMany();
  }
}
