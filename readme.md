# Teste DEVAPI - Nodejs

Projeto criado para o teste técnico da empresa devapi.

Projeto criado utilizando principios de SOLID, Clean Code, Clean Architecture e Testes Automatizados.

Apesar de já conhecer a plataforma **Nest.js** optei por criar este projeto utilizando *Express* e uma arquitetura própria para demonstrar um pouco mais a fundo o meu conhecimento em aplicações Node.js e arquitetura de aplicações *Rest*.


## Instalação

Após o clone ou download do projeto:

Utilize o gerenciador de pacotes ```npm``` ou ```yarn``` para instalar as dependencias do projeto.

```bash
yarn install 
```

## Utilização

Configure as variáveis de ambiente em um arquivo ```.env ``` para simular produção ou ```.env.dev ```, caso prefira pode também editar as configurações padrão no arquivo ```./src/config/index.ts```

Valores padrões para as variaveis de ambiente:
```
PORT=3000
DB_URI='mongodb://localhost/devapi-db'
SALT_KEY='secret-key'
```

Após verificar as variáveis de ambiente rode o comando para rodar em desenvolvimento:

```bash
yarn dev
``` 

## Testes automatizados
Para rodar os testes unitários utilize o comando:
```bash
yarn test
```

Para rodar os testes de integração utilize o comando:

**Observação: certifique as que variáveis no arquivo ```.env.test``` estejam configuradas corretamente**
```bash
yarn test:integration
```


## Dados iniciais

Para adicionar dados iniciais basta se conectar ao banco de dados mongodb via terminal ou gerenciador de banco de dados, copiar e colar o conteudo do script localizado em ```./scripts/insert-initial-data.sh```


***usuario inicial:*** gustavo@email.com \
***senha:*** 123456



## Rotas da aplicação
```
--- Auth
[POST] /auth/signip - Para criação de um usuário
[POST] /auth/login - Para autenticação de um usuário

--- Connectors
[GET] /connectors - Para busca e filtro(via queryparams) de conectores
[POST] /connectors - Para criação de um conector
[PUT] /connectors/id - Para edição de um conector
[DELETE] /connectors/id - Para remover um conector (exclusão logica)

```


~Autor: Gustavo C. Oliveira

