import { AppDataSource } from "../data-source";
import { MusicaPlaylistEntity } from "../entity/musicaPlaylist.entity";
import { PlaylistEntity } from "../entity/playlist.entity";

export class PlaylistService {
  private playlistRepository = AppDataSource.getRepository(PlaylistEntity);
  private musicaPlaylistRepository =
    AppDataSource.getRepository(MusicaPlaylistEntity);

  async criarPlaylist(
    usuarioId: number,
    nome: string
  ): Promise<PlaylistEntity> {
    const lastPlaylist = await this.playlistRepository.findOne({
      where: { usuarioId },
      order: { playlistId: "DESC" },
    });

    const playlistId = lastPlaylist ? lastPlaylist.playlistId + 1 : 1;

    const playlist = this.playlistRepository.create({
      playlistId,
      usuarioId,
      nome,
    });

    return await this.playlistRepository.save(playlist);
  }

  async buscarPorId(
    playlistId: number,
    usuarioId: number
  ): Promise<PlaylistEntity | null> {
    return await this.playlistRepository.findOne({
      where: { playlistId, usuarioId },
      relations: ["usuario"],
    });
  }

  async buscarPorUsuario(usuarioId: number): Promise<PlaylistEntity[]> {
    return await this.playlistRepository.find({
      where: { usuarioId },
      relations: ["usuario"],
    });
  }

  async adicionarMusica(
    musicaId: number,
    playlistId: number,
    usuarioId: number
  ): Promise<MusicaPlaylistEntity> {
    const lastEntry = await this.musicaPlaylistRepository.findOne({
      where: { playlistId, usuarioId },
      order: { ordemNaPlaylist: "DESC" },
    });

    const ordemNaPlaylist = lastEntry ? lastEntry.ordemNaPlaylist + 1 : 1;

    const musicaPlaylist = this.musicaPlaylistRepository.create({
      musicaId,
      playlistId,
      usuarioId,
      ordemNaPlaylist,
    });

    return await this.musicaPlaylistRepository.save(musicaPlaylist);
  }

  async removerMusica(
    musicaId: number,
    playlistId: number,
    usuarioId: number
  ): Promise<boolean> {
    const result = await this.musicaPlaylistRepository.delete({
      musicaId,
      playlistId,
      usuarioId,
    });

    return result.affected ? result.affected > 0 : false;
  }

  async buscarMusicasDaPlaylist(
    playlistId: number,
    usuarioId: number
  ): Promise<MusicaPlaylistEntity[]> {
    return await this.musicaPlaylistRepository.find({
      where: { playlistId, usuarioId },
      relations: ["musica", "musica.artista"],
      order: { ordemNaPlaylist: "ASC" },
    });
  }
}
