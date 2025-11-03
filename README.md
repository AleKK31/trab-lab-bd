# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `data-source.ts` file
3. Run `npm start` command

# trab-lab-bd

---

# ✅ Implementação Completa - CRUD e Relacionamentos

## 📋 Requisitos Implementados

### ✅ 1. CRUD Básico - ARTISTA

- **Criar**: `artistaService.criar(nome, nacionalidade)`
- **Ler por ID**: `artistaService.buscarPorId(id)`
- **Atualizar**: `artistaService.atualizar(id, dados)`
- **Deletar**: `artistaService.deletar(id)`

**Arquivo**: `src/service/artista.service.ts`

### ✅ 2. CRUD Básico - MÚSICA

- **Criar**: `musicaService.criar(titulo, duracaoSegundos, artistaId)`
- **Ler por ID**: `musicaService.buscarPorId(id)`
- **Atualizar**: `musicaService.atualizar(id, dados)`
- **Deletar**: `musicaService.deletar(id)`

**Arquivo**: `src/service/musica.service.ts`

### ✅ 3. Criação de Playlist

- **Criar Playlist**: `playlistService.criarPlaylist(usuarioId, nome)`
- Cria playlist "Clássicos do Alexandre" para usuário Alexandre
- Playlist automaticamente associada ao usuário

**Arquivo**: `src/service/playlist.service.ts`

### ✅ 4. Gerenciamento N:N - Adicionar Música

- **Adicionar**: `playlistService.adicionarMusica(musicaId, playlistId, usuarioId)`
- Adiciona música a playlist existente
- Ordem gerenciada automaticamente
- Relacionamento many-to-many através de `musica_playlist`

**Arquivo**: `src/service/playlist.service.ts`

### ✅ 5. Gerenciamento N:N - Remover Música

- **Remover**: `playlistService.removerMusica(musicaId, playlistId, usuarioId)`
- Remove música de playlist existente
- Mantém integridade referencial

**Arquivo**: `src/service/playlist.service.ts`

## 🗂️ Arquivos Criados

### Serviços (Lógica de Negócio)

1. **`src/service/artista.service.ts`** - CRUD completo de Artista
2. **`src/service/musica.service.ts`** - CRUD completo de Música
3. **`src/service/usuario.service.ts`** - Operações de Usuário
4. **`src/service/playlist.service.ts`** - Playlist e gerenciamento N:N

### Demonstração e Testes

5. **`src/index.ts`** - Demonstração completa de todas as operações
6. **`src/test.ts`** - Testes rápidos das funcionalidades

### Documentação

7. **`OPERACOES.md`** - Documentação técnica completa
8. **`GUIA_USO.md`** - Guia de uso com exemplos práticos
9. **`RESUMO.md`** - Este arquivo (resumo da implementação)

## 🎯 Exemplo de Uso Completo

```typescript
import { ArtistaService } from "./service/artista.service";
import { MusicaService } from "./service/musica.service";
import { UsuarioService } from "./service/usuario.service";
import { PlaylistService } from "./service/playlist.service";

// 1. CRUD de Artista
const artistaService = new ArtistaService();
const artista = await artistaService.criar("Beatles", "Inglaterra");
const encontrado = await artistaService.buscarPorId(artista.id);
const atualizado = await artistaService.atualizar(artista.id, {
  nacionalidade: "Reino Unido",
});
const deletado = await artistaService.deletar(artista.id);

// 2. CRUD de Música
const musicaService = new MusicaService();
const musica1 = await musicaService.criar("Hey Jude", 431, artista.id);
const musica2 = await musicaService.criar("Let It Be", 243, artista.id);
const musicaEncontrada = await musicaService.buscarPorId(musica1.id);
const musicaAtualizada = await musicaService.atualizar(musica1.id, {
  duracaoSegundos: 430,
});

// 3. Criar Usuário "Alexandre"
const usuarioService = new UsuarioService();
const alexandre = await usuarioService.criar(
  "Alexandre",
  "alexandre@email.com"
);

// 4. Criar Playlist "Clássicos do Alexandre"
const playlistService = new PlaylistService();
const playlist = await playlistService.criarPlaylist(
  alexandre.id,
  "Clássicos do Alexandre"
);

// 5. Adicionar músicas à playlist (N:N)
await playlistService.adicionarMusica(
  musica1.id,
  playlist.playlistId,
  alexandre.id
);
await playlistService.adicionarMusica(
  musica2.id,
  playlist.playlistId,
  alexandre.id
);

// 6. Listar músicas da playlist
const musicas = await playlistService.buscarMusicasDaPlaylist(
  playlist.playlistId,
  alexandre.id
);
// Resultado: 2 músicas em ordem

// 7. Remover música da playlist (N:N)
await playlistService.removerMusica(
  musica2.id,
  playlist.playlistId,
  alexandre.id
);
// Resultado: apenas 1 música restante
```

## 🏃 Como Executar

```bash
# Instalar dependências
npm install

# Executar demonstração completa (src/index.ts)
npm start

# Executar testes rápidos (src/test.ts)
npm test
```
