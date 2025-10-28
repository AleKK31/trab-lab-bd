import { AppDataSource } from "./data-source";
import { ArtistaEntity } from "./entity/artista.entity";

AppDataSource.initialize()
  .then(async () => {
    console.log("Inserting a new artist into the database...");
    const artist = new ArtistaEntity();
    artist.nome = "Test Artist";
    artist.nacionalidade = "Brasil";
    await AppDataSource.manager.save(artist);
    console.log("Saved a new artist with id: " + artist.id);

    console.log("Loading artists from the database...");
    const artists = await AppDataSource.manager.find(ArtistaEntity);
    console.log("Loaded artists: ", artists);
  })
  .catch((error) => console.log(error));
