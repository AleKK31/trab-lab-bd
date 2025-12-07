import { AppDataSource } from "../data-source";
import { ArtistaEntity } from "../entity/artista.entity";
import { MusicaEntity } from "../entity/musica.entity";
import { MusicaPlaylistEntity } from "../entity/musicaPlaylist.entity";
import { PlaylistEntity } from "../entity/playlist.entity";
import { UsuarioEntity } from "../entity/usuario.entity";

export class SelectsService {
  private playlistRepository = AppDataSource.getRepository(PlaylistEntity);
  private musicaPlaylistRepository =
    AppDataSource.getRepository(MusicaPlaylistEntity);
  private artistasRepository = AppDataSource.getRepository(ArtistaEntity);
  private usuarioRepository = AppDataSource.getRepository(UsuarioEntity);
  private musicaRepository = AppDataSource.getRepository(MusicaEntity);

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

  async listarMusicaComArtista(musicaId: number) {
    return await this.musicaRepository
    .createQueryBuilder("musica")
    .leftJoinAndSelect("musica.artista", "artista")
    .where("musica.id = :musicaId", { musicaId })
    .getMany()
  }

  async listarTotalReproducaoPlaylist(){
    return await this.musicaPlaylistRepository
    .createQueryBuilder("mp")
    .innerJoin("mp.musica", "musica")
    .innerJoin("mp.playlist", "playlist")
    .innerJoin("playlist.usuario", "usuario")
    .select("playlist.nome", "playlistNome")
    .addSelect("SUM(musica.duracao_segundos)", "tempoDeReproducao")
    .groupBy("playlist.playlist_id")
    .addGroupBy("playlist.nome")
    .addGroupBy("playlist.usuario_id").getRawMany();

  }

  async listarMusicasComDuracaoMenorQueMediaDoArtista() {
    return await this.musicaRepository
      .createQueryBuilder("musica")
      .where(sb => {
        const subquery = sb.subQuery()
        .select("AVG(musica2.duracao_segundos)")
        .from(MusicaEntity, "musica2")
        .where("musica2.artista_id = musica.artista_id")
        .getQuery();
        return "musica.duracao_segundos < " + subquery;
      })
      .getMany();
  }

  async listarMusicasComOrdemNaPlaylist() {
    return await this.musicaPlaylistRepository
      .createQueryBuilder("mp")
      .innerJoin("mp.musica", "musica")
      .innerJoin("mp.playlist", "playlist")
      .where("playlist.nome = :nome", {nome : "Rock do Pablo"})
      .select("musica.titulo", "titulo")
      .addSelect("mp.ordem_na_playlist", "ordemNaPlaylist")
      .orderBy("mp.ordem_na_playlist", "ASC")
      .getRawMany();
  }


}
