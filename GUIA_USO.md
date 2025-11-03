# Guia de Uso Rápido - Sistema de Músicas

## 🚀 Como Executar

### Pré-requisitos

- Node.js instalado
- PostgreSQL rodando
- Arquivo `.env` configurado

### Comandos

```bash
# Instalar dependências
npm install

# Executar demonstração completa
npm start

# Executar testes rápidos
npm test
```

## 📚 Exemplos Práticos

### 1. CRUD de Artista

```typescript
import { ArtistaService } from "./service/artista.service";

const artistaService = new ArtistaService();

// Criar
const artista = await artistaService.criar("Beatles", "Inglaterra");
// { id: 1, nome: "Beatles", nacionalidade: "Inglaterra" }

// Buscar por ID
const encontrado = await artistaService.buscarPorId(1);
// { id: 1, nome: "Beatles", nacionalidade: "Inglaterra" }

// Atualizar
const atualizado = await artistaService.atualizar(1, {
  nacionalidade: "Reino Unido",
});
// { id: 1, nome: "Beatles", nacionalidade: "Reino Unido" }

// Deletar
const deletado = await artistaService.deletar(1);
// true
```

### 2. CRUD de Música

```typescript
import { MusicaService } from "./service/musica.service";

const musicaService = new MusicaService();

// Criar
const musica = await musicaService.criar("Hey Jude", 431, artistaId);
// { id: 1, titulo: "Hey Jude", duracaoSegundos: 431, artistaId: 1 }

// Buscar por ID (com artista)
const encontrada = await musicaService.buscarPorId(1);
// { id: 1, titulo: "Hey Jude", duracaoSegundos: 431,
//   artista: { id: 1, nome: "Beatles", ... } }

// Atualizar
const atualizada = await musicaService.atualizar(1, {
  duracaoSegundos: 430,
});
// { id: 1, titulo: "Hey Jude", duracaoSegundos: 430, ... }

// Deletar
const deletada = await musicaService.deletar(1);
// true
```

### 3. Criar Playlist para Usuário

```typescript
import { UsuarioService } from "./service/usuario.service";
import { PlaylistService } from "./service/playlist.service";

const usuarioService = new UsuarioService();
const playlistService = new PlaylistService();

// 1. Criar usuário
const usuario = await usuarioService.criar("Alexandre", "alexandre@email.com");
// { id: 1, username: "Alexandre", email: "alexandre@email.com" }

// 2. Criar playlist para o usuário
const playlist = await playlistService.criarPlaylist(
  usuario.id,
  "Clássicos do Alexandre"
);
// { playlistId: 1, usuarioId: 1, nome: "Clássicos do Alexandre",
//   dataCriacao: 2025-11-03T... }
```

### 4. Adicionar Músicas à Playlist (N:N)

```typescript
// Adicionar primeira música
await playlistService.adicionarMusica(
  musicaId1, // ID da música
  playlistId, // ID da playlist
  usuarioId // ID do usuário
);
// ordem_na_playlist: 1

// Adicionar segunda música
await playlistService.adicionarMusica(musicaId2, playlistId, usuarioId);
// ordem_na_playlist: 2

// Adicionar terceira música
await playlistService.adicionarMusica(musicaId3, playlistId, usuarioId);
// ordem_na_playlist: 3
```

### 5. Listar Músicas da Playlist

```typescript
const musicas = await playlistService.buscarMusicasDaPlaylist(
  playlistId,
  usuarioId
);

// Resultado (ordenado por ordem_na_playlist):
// [
//   {
//     musicaId: 1,
//     playlistId: 1,
//     usuarioId: 1,
//     ordemNaPlaylist: 1,
//     musica: {
//       id: 1,
//       titulo: "Hey Jude",
//       duracaoSegundos: 431,
//       artista: { nome: "Beatles", nacionalidade: "Reino Unido" }
//     }
//   },
//   {
//     ordemNaPlaylist: 2,
//     musica: { titulo: "Let It Be", ... }
//   },
//   ...
// ]

// Exibir de forma bonita:
musicas.forEach((mp) => {
  console.log(
    `${mp.ordemNaPlaylist}. ${mp.musica.titulo} - ` +
      `${mp.musica.artista.nome} (${mp.musica.duracaoSegundos}s)`
  );
});
// 1. Hey Jude - Beatles (431s)
// 2. Let It Be - Beatles (243s)
// 3. Que País é Este - Legião Urbana (294s)
```

### 6. Remover Música da Playlist (N:N)

```typescript
const removido = await playlistService.removerMusica(
  musicaId2, // ID da música a remover
  playlistId, // ID da playlist
  usuarioId // ID do usuário
);
// true

// Verificar resultado
const musicasAtualizadas = await playlistService.buscarMusicasDaPlaylist(
  playlistId,
  usuarioId
);
// Agora só tem 2 músicas (ordem 1 e 3)
```

## 🔍 Casos de Uso Completos

### Cenário 1: Criar uma Playlist de Rock Clássico

```typescript
// 1. Criar artistas
const beatles = await artistaService.criar("Beatles", "Reino Unido");
const queen = await artistaService.criar("Queen", "Reino Unido");
const acdc = await artistaService.criar("AC/DC", "Austrália");

// 2. Criar músicas
const m1 = await musicaService.criar("Hey Jude", 431, beatles.id);
const m2 = await musicaService.criar("Bohemian Rhapsody", 354, queen.id);
const m3 = await musicaService.criar("Highway to Hell", 208, acdc.id);

// 3. Criar usuário e playlist
const usuario = await usuarioService.criar("João", "joao@email.com");
const playlist = await playlistService.criarPlaylist(
  usuario.id,
  "Rock Clássico"
);

// 4. Adicionar todas as músicas
await playlistService.adicionarMusica(m1.id, playlist.playlistId, usuario.id);
await playlistService.adicionarMusica(m2.id, playlist.playlistId, usuario.id);
await playlistService.adicionarMusica(m3.id, playlist.playlistId, usuario.id);

// 5. Listar resultado
const musicas = await playlistService.buscarMusicasDaPlaylist(
  playlist.playlistId,
  usuario.id
);
console.log(`Playlist "${playlist.nome}" tem ${musicas.length} músicas`);
```

### Cenário 2: Atualizar Dados de uma Música

```typescript
// 1. Buscar música
const musica = await musicaService.buscarPorId(1);
console.log(`Antes: ${musica.titulo} - ${musica.duracaoSegundos}s`);

// 2. Atualizar
await musicaService.atualizar(1, {
  titulo: "Hey Jude (Remastered)",
  duracaoSegundos: 430,
});

// 3. Verificar
const atualizada = await musicaService.buscarPorId(1);
console.log(`Depois: ${atualizada.titulo} - ${atualizada.duracaoSegundos}s`);
```

## ⚠️ Observações Importantes

### Ordem na Playlist

- A ordem é gerenciada automaticamente
- Cada nova música recebe o próximo número sequencial
- A remoção não reordena as músicas existentes

### Chaves Compostas

- Playlist: `(playlist_id, usuario_id)`
- MusicaPlaylist: `(musica_id, playlist_id, usuario_id)`

### Restrições

- Duração da música deve ser > 0
- Nome do artista é único
- Username e email são únicos
- Não pode remover artista com músicas (RESTRICT)
- Remover playlist remove suas músicas automaticamente (CASCADE)

## 📁 Estrutura dos Serviços

```
src/service/
├── artista.service.ts      # CRUD de Artista
├── musica.service.ts       # CRUD de Música
├── usuario.service.ts      # Operações de Usuário
└── playlist.service.ts     # Playlist + Gerenciamento N:N
```

## 🎯 Checklist de Implementação

- ✅ CRUD de ARTISTA (criar, ler, atualizar, deletar)
- ✅ CRUD de MUSICA (criar, ler, atualizar, deletar)
- ✅ Criar PLAYLIST associada a USUARIO
- ✅ Adicionar MUSICA a PLAYLIST (N:N)
- ✅ Remover MUSICA de PLAYLIST (N:N)
- ✅ Listar músicas da playlist em ordem
- ✅ Relacionamentos com cascata apropriada
- ✅ Validações e constraints
