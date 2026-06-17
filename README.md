# CareBoard

CareBoard e um painel de enfermarias para gerenciamento de demandas de enfermagem. O objetivo do projeto e centralizar, em uma unica interface, a visualizacao dos leitos, pacientes internados, chamados ativos e solicitacoes feitas pelo paciente.

A aplicacao simula a comunicacao em tempo real entre paciente e equipe de enfermagem: o paciente acessa sua tela pelo leito, solicita necessidades como assistencia, alimentacao, medicacao ou emergencia, e o painel da enfermagem recebe essas demandas via WebSocket sem precisar recarregar a pagina.

## Funcionalidades principais

- Login de profissionais e pacientes.
- Rotas protegidas para impedir acesso sem autenticacao.
- Selecao de unidade de internacao.
- Dashboard de enfermagem com mapa de leitos e chamadas ativas.
- Tela do paciente para abertura e acompanhamento de demandas.
- Comunicacao em tempo real com Socket.IO.
- API NestJS conectada ao PostgreSQL.
- Seed automatico com hospital, unidades, leitos, pacientes, usuarios e demandas iniciais.

## Autenticacao e rotas protegidas

A rota publica do sistema e somente `/`, que exibe a tela de login.

Todas as demais rotas passam pelo componente `ProtectedRoute`, implementado em:

- `frontend/src/routes/ProtectedRoute.tsx`
- `frontend/src/routes/AppRoutes.tsx`

As rotas protegidas sao:

- `/first-access`
- `/select-unit`
- `/dashboard`
- `/patient`

Se o usuario tentar acessar qualquer uma dessas rotas sem uma sessao autenticada, ele e redirecionado para `/`. A sessao fica armazenada no `localStorage`, entao o usuario continua autenticado ao atualizar a pagina.

## Gerenciamento de estado

O projeto usa Context API com `useReducer`, implementado em:

- `frontend/src/contexts/AuthContext.tsx`

Essa escolha foi feita porque o estado global necessario neste projeto e pequeno e bem definido: a sessao do usuario autenticado. Para esse caso, Context API + reducer atende bem sem adicionar uma dependencia externa como Redux, Zustand ou Jotai.

O reducer centraliza as transicoes de autenticacao:

- `LOGIN`: salva o usuario autenticado no estado global.
- `LOGOUT`: remove a sessao do estado global.

O `AuthProvider` tambem sincroniza a sessao com o `localStorage`, permitindo que `ProtectedRoute`, `Login` e `Patient` usem a mesma fonte de verdade para saber se existe usuario logado e qual e o perfil dele.

## Estrutura de pastas

```txt
CareBoard/
+-- api/
+-- frontend/
+-- docker-compose.yml
`-- README.md
```

### Frontend

O frontend fica em `frontend/` e foi desenvolvido com React, TypeScript, Vite, Tailwind CSS, React Router, React Toastify e Socket.IO Client.

```txt
frontend/src/
+-- components/
|   +-- dashboard/
|   `-- patient/
+-- contexts/
+-- hooks/
+-- pages/
+-- routes/
+-- services/
+-- types/
+-- App.tsx
`-- main.tsx
```

Principais partes:

- `pages/Login.tsx`: autentica profissionais e pacientes usando a API.
- `pages/SelectUnit.tsx`: lista as unidades de internacao disponiveis.
- `pages/Dashboard.tsx`: exibe o painel da enfermagem, mapa de leitos e chamadas ativas.
- `pages/Patient.tsx`: tela do paciente para abertura de demandas.
- `routes/AppRoutes.tsx`: registra as rotas da aplicacao.
- `routes/ProtectedRoute.tsx`: bloqueia rotas para usuarios nao autenticados.
- `contexts/AuthContext.tsx`: estado global de autenticacao com Context API + reducer.
- `hooks/usePatientDemands.tsx`: integra a tela do paciente com WebSocket e API de demandas.
- `components/dashboard/`: cards, lista de chamadas e cabecalho do painel.
- `components/patient/`: componentes da experiencia do paciente.
- `types/`: tipos TypeScript usados nas telas.

### API

A API fica em `api/` e foi desenvolvida com NestJS, TypeORM e PostgreSQL.

```txt
api/src/
+-- modules/
|   +-- auth/
|   +-- dashboard/
|   +-- demanda/
|   +-- hospital/
|   +-- internacao/
|   +-- leito/
|   +-- paciente/
|   +-- seed/
|   +-- sinais-vitais/
|   +-- status-leito/
|   `-- unidade/
+-- app.module.ts
`-- main.ts
```

Principais modulos:

- `auth`: login de profissionais e pacientes.
- `dashboard`: dados consolidados para o painel da enfermagem.
- `demanda`: criacao, conclusao e listagem de demandas pendentes.
- `seed`: carga inicial de dados para facilitar a execucao do projeto.
- `leito`, `paciente`, `internacao`, `unidade` e `hospital`: entidades principais do dominio hospitalar.
- `sinais-vitais`: estrutura de sinais vitais e calculos clinicos associados ao paciente.

A documentacao Swagger da API fica disponivel em:

```txt
http://localhost:3000/docs
```

### WebSocket

O WebSocket fica principalmente em:

- `api/src/modules/demanda/presentation/realtime/pending-demand.gateway.ts`
- `api/src/modules/demanda/application/services/pending-demand.service.ts`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/hooks/usePatientDemands.tsx`

A API usa Socket.IO para emitir atualizacoes de demandas pendentes. Quando um cliente se conecta, ele recebe a lista atual de demandas pendentes pelo evento:

```txt
demand:pending:list
```

Quando uma nova demanda aparece, a API tambem emite:

```txt
demand:pending:new
```

O gateway atualiza os clientes em duas situacoes:

- quando uma demanda e criada ou concluida pela API;
- periodicamente, por polling interno, para manter a lista sincronizada.

No frontend, o dashboard da enfermagem escuta esses eventos para atualizar a lista de chamadas ativas. A tela do paciente tambem escuta os mesmos eventos para exibir as demandas abertas daquele leito/internacao.

## Como executar com Docker Compose

Requisitos:

- Docker
- Docker Compose

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Servicos criados:

- PostgreSQL: `localhost:5432`
- API NestJS: `http://localhost:3000`
- Frontend Vite: `http://localhost:5173`

Depois que os containers subirem, acesse:

```txt
http://localhost:5173
```

## Usuarios para teste

O seed cria um usuario de enfermagem:

```txt
Usuario: hrsj
Senha: 123456
```

Tambem cria usuarios de paciente a partir dos numeros dos leitos. Exemplos:

```txt
Usuario: 101
Senha: 123456
```

```txt
Usuario: 102
Senha: 123456
```

Pacientes tambem podem autenticar usando o numero do leito com prefixo `L`, como `L101`.

## Execucao local sem Docker

Caso queira executar sem Docker, rode API e frontend separadamente.

API:

```bash
cd api
npm install
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Para esse modo, e necessario ter um PostgreSQL disponivel e configurar as variaveis de banco usadas pela API:

```txt
DB_HOST
DB_PORT
DB_USERNAME
DB_PASSWORD
DB_DATABASE
```

## Build do frontend

Para validar a aplicacao React:

```bash
cd frontend
npm run build
```
