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
  private dataSource = AppDataSource;

  async listarPlaylistsPorUsername(username: string) {
    const playlist = await this.playlistRepository
      .createQueryBuilder("playlist")
      .innerJoin("playlist.usuario", "usuario")
      .where("usuario.username = :username", { username })
      .select(["playlist.nome AS nome", "playlist.dataCriacao AS dataCriacao"])
      .getRawMany();

    return playlist;
  }

  async listarPlaylistsPorUsername2(username: string) {
    const plasy2 = await this.playlistRepository.find({
      where: { usuario: { username } },
      select: ["nome", "dataCriacao"],
      relations: ["usuario"],
    });
    return plasy2;
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
      .getMany();
  }

  async listarTotalReproducaoPlaylist() {
    return await this.musicaPlaylistRepository
      .createQueryBuilder("mp")
      .innerJoin("mp.musica", "musica")
      .innerJoin("mp.playlist", "playlist")
      .innerJoin("playlist.usuario", "usuario")
      .select("playlist.nome", "playlistNome")
      .addSelect("SUM(musica.duracao_segundos)", "tempoDeReproducao")
      .groupBy("playlist.playlist_id")
      .addGroupBy("playlist.nome")
      .addGroupBy("playlist.usuario_id")
      .getRawMany();
  }

  async listarMusicasComDuracaoMenorQueMediaDoArtista() {
    return await this.musicaRepository
      .createQueryBuilder("musica")
      .where((sb) => {
        const subquery = sb
          .subQuery()
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
      .where("playlist.nome = :nome", { nome: "Rock do Pablo" })
      .select("musica.titulo", "titulo")
      .addSelect("mp.ordem_na_playlist", "ordemNaPlaylist")
      .orderBy("mp.ordem_na_playlist", "ASC")
      .getRawMany();
  }

  async buscaPorChaveCompostaInvertida() {
    return await this.musicaRepository
      .createQueryBuilder("musica")
      .innerJoin("musica.musicaPlaylists", "mp")
      .innerJoin("mp.playlist", "playlist")
      .innerJoin("playlist.usuario", "usuario")
      .where("musica.titulo = :titulo", { titulo: "Bohemian Rhapsody" })
      .select([
        "usuario.username AS username",
        "playlist.nome AS playlist_nome",
        "musica.titulo AS musica_titulo",
      ])
      .getRawMany();
  }

  async rankingPopularidadeArtistas() {
    return await this.artistasRepository
      .createQueryBuilder("artista")
      .innerJoin("artista.musicas", "musica")
      .innerJoin("musica.musicaPlaylists", "mp")
      .select([
        "artista.nome AS artista",
        "COUNT(DISTINCT mp.playlist_id) AS total_playlists",
      ])
      .addSelect(
        "DENSE_RANK() OVER (ORDER BY COUNT(DISTINCT mp.playlist_id) DESC)",
        "ranking"
      )
      .groupBy("artista.id")
      .orderBy("ranking", "ASC")
      .getRawMany();
  }

  async comparaçãoComTop1(artistaPrincipal: string, artistaComparacao: string) {
    const subQuery = this.musicaRepository
      .createQueryBuilder("m2")
      .select("MAX(m2.duracaoSegundos)")
      .innerJoin("m2.artista", "a2")
      .where("a2.nome = :artistaComparacao");

    return await this.musicaRepository
      .createQueryBuilder("musica")
      .innerJoin("musica.artista", "artista")
      .where("artista.nome = :artistaPrincipal", { artistaPrincipal })

      .andWhere(`musica.duracaoSegundos > (${subQuery.getQuery()})`)

      .setParameters({ artistaComparacao })
      .select([
        "musica.titulo AS musica",
        "musica.duracaoSegundos AS duracao",
        "artista.nome AS artista",
      ])
      .getRawMany();
  }

  async transferirMusicaAtomicamente(
    usuarioId: number,
    musicaId: number,
    playlistOrigemId: number,
    playlistDestinoId: number
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const manager = queryRunner.manager;

      const registroOrigem = await manager.findOne(MusicaPlaylistEntity, {
        where: {
          playlistId: playlistOrigemId,
          usuarioId: usuarioId,
          musicaId: musicaId,
        },
      });

      if (!registroOrigem) {
        throw new Error(
          `Música (ID: ${musicaId}) não encontrada na Playlist de origem ou não pertence ao usuário.`
        );
      }

      const ultimaNaDestino = await manager.findOne(MusicaPlaylistEntity, {
        where: { playlistId: playlistDestinoId, usuarioId: usuarioId },
        order: { ordemNaPlaylist: "DESC" },
      });
      const novaOrdem = ultimaNaDestino
        ? ultimaNaDestino.ordemNaPlaylist + 1
        : 1;

      await manager.remove(registroOrigem);

      const novoRegistro = new MusicaPlaylistEntity();
      novoRegistro.playlistId = playlistDestinoId;
      novoRegistro.usuarioId = usuarioId;
      novoRegistro.musicaId = musicaId;
      novoRegistro.ordemNaPlaylist = novaOrdem;

      await manager.save(novoRegistro);

      await queryRunner.commitTransaction();
      return {
        sucesso: true,
        msg: "Transferência realizada com sucesso (COMMIT).",
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        sucesso: false,
        msg: `Falha na transação (ROLLBACK): ${error.message}`,
      };
    } finally {
      await queryRunner.release();
    }
  }
}
