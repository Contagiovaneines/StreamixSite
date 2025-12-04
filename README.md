# StreamixSite - Plataforma IPTV

Uma aplicação web moderna para streaming IPTV com interface elegante e intuitiva, desenvolvida em React + TypeScript + Vite.

## 🚀 Funcionalidades

- **Sistema de Login IPTV**: Autenticação com servidor IPTV usando URL, usuário e senha
- **Gerenciamento de Perfis**: Suporte a múltiplos perfis de usuário (até 4 perfis)
- **TV ao Vivo**: Navegação por categorias e canais de TV ao vivo
- **Filmes (VOD)**: Biblioteca de filmes organizados por categorias
- **Séries**: Catálogo de séries com temporadas e episódios
- **Configurações**: Gerenciamento de conta e preferências

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório
2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure a API do Gemini (opcional):
   - Crie um arquivo `.env.local` na raiz do projeto
   - Adicione sua chave: `GEMINI_API_KEY=sua_chave_aqui`

4. Execute a aplicação:
   ```bash
   npm run dev
   ```

A aplicação estará disponível em `http://localhost:3000`

## 🔐 Sistema de Login

### Credenciais Padrão para Teste
- **Usuário**: `demo`
- **Senha**: (qualquer senha)
- **URL do Servidor**: `http://cheapflix.us:25461`

### Como Funciona o Login

O sistema aceita credenciais IPTV padrão:
- **URL**: Endereço do servidor IPTV (geralmente inclui IP e porta)
- **Usuário**: Nome de usuário fornecido pelo provedor IPTV
- **Senha**: Senha da conta IPTV

Após o login bem-sucedido, o usuário é direcionado para a tela de seleção de perfis.

## 🎭 Perfis de Usuário

A aplicação suporta até 4 perfis diferentes:
- **Admin**: Perfil principal sem restrições
- **Kids**: Perfil infantil com conteúdo filtrado
- **Guest**: Perfil para visitantes (bloqueado por padrão)
- **Personalizado**: Adicione seu próprio perfil

## 🌐 APIs e Integração

### Mock API (Desenvolvimento)
Atualmente, a aplicação usa uma **Mock API** (`services/mockApi.ts`) que simula as respostas de um servidor IPTV real. Isso permite testar a interface sem necessidade de um servidor IPTV ativo.

### Estrutura da API

A Mock API simula os seguintes endpoints:

1. **Login**
   ```typescript
   login(username, password, url) → LoginResponse
   ```
   Retorna informações do usuário e servidor

2. **Categorias**
   ```typescript
   getLiveCategories() → Category[]
   getVodCategories() → Category[]
   getSeriesCategories() → Category[]
   ```

3. **Conteúdo**
   ```typescript
   getLiveStreams(categoryId) → LiveStream[]
   getVodStreams(categoryId) → VodStream[]
   getSeries(categoryId) → Series[]
   getSeriesInfo(seriesId) → SeriesDetails
   ```

### Integração com API Real

Para conectar a uma API IPTV real, substitua as funções em `services/mockApi.ts` por chamadas HTTP reais usando axios ou fetch:

```typescript
// Exemplo com fetch
const login = async (username, password, url) => {
  const response = await fetch(`${url}/player_api.php`, {
    method: 'POST',
    body: JSON.stringify({ username, password, action: 'login' })
  });
  return response.json();
};
```

## 🛠️ Tecnologias Utilizadas

- **React 19**: Framework principal
- **TypeScript**: Tipagem estática
- **Vite**: Build tool e dev server
- **Tailwind CSS**: Estilização
- **Lucide React**: Ícones
- **Mock API**: Simulação de backend IPTV

## 📁 Estrutura do Projeto

```
StreamixSite/
├── components/          # Componentes reutilizáveis
│   ├── Modal.tsx
│   ├── Sidebar.tsx
│   └── VideoPlayer.tsx
├── services/           # Serviços e APIs
│   └── mockApi.ts
├── views/              # Páginas/Visualizações
│   ├── LiveTv.tsx
│   ├── Movies.tsx
│   ├── Series.tsx
│   ├── Settings.tsx
│   └── Profiles.tsx
├── App.tsx             # Componente principal
├── types.ts            # Definições TypeScript
└── index.tsx           # Entry point
```

## 🎨 Personalização

- **Cores**: Edite as classes Tailwind em cada componente
- **Logo**: Substitua o título no componente Sidebar
- **Perfis**: Modifique o array de perfis em `App.tsx`
- **Mock Data**: Edite os dados em `services/mockApi.ts`

## 📝 Próximos Passos

- [ ] Integrar API IPTV real
- [ ] Adicionar sistema de favoritos
- [ ] Implementar busca global
- [ ] Adicionar histórico de reprodução
- [ ] Suporte a legendas
- [ ] Player com controles avançados

## 📄 Licença

Este projeto é de código aberto para fins educacionais.
