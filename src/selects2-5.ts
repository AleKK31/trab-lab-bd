import { AppDataSource } from "./data-source";
import { SelectsService } from "./service/selects2-1.service";

async function main() {
  await AppDataSource.initialize();

  const selectsService = new SelectsService();

  try {
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
