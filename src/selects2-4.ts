import { AppDataSource } from "./data-source";
import { SelectsService } from "./service/selects2-1.service";

async function main() {
  await AppDataSource.initialize();

  const selectsService = new SelectsService();

  try {
    console.log("2.4.10 - Rank de Popularidade do Artista");
    const ranking = await selectsService.rankingPopularidadeArtistas();
    console.log(`\nRESULTADO: ${JSON.stringify(ranking)} \n---------\n`);

    console.log("2.4.11 - Desafio Subquery: Led Zeppelin > Top 1 Queen");
    const comparacao = await selectsService.comparaçãoComTop1(
      "Led Zeppelin",
      "Queen"
    );
    console.log(`\nRESULTADO: ${JSON.stringify(comparacao)} \n---------\n`);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

main();
