Essa aplicação foi criada como parte do Desafio da 9ª turma do GoStack. Trata-se de um aplicativo de gerenciamento de matriculas de alunos em uma academia "GymPoint". Nele os administradores poderão cadastrar e atualizar dados dos alunos, além de criar e atualizar planos.

A aplicação foi desenvolvida em Node.js utilizando Express.

Ferramentas usadas:

Sucrase + Nodemon;
ESLint + Prettier + EditorConfig;
Sequelize PostgreSQL;
Nodemailer + Bee-queue;


Funcionalidades:

Autenticação por meio de usuário e senha;
Autenticação feita utilizando JWT;
Somente administrador tem autenticação;
Dados validados utilizando Yup;
Somente administradores podem fazer o cadastro e alteração de alunos;
Alunos não se autenticam no sistema;
Envio de e-mail ao efetuar matricula, informando todos os dados do plano escolhido;
O aluno poderá enviar pedido de auxílio e será notificado por e-mail quando for respondido;

Comandos para inicializar:

inicializar o nodemon - yarn dev
inicializar o bee-queue - yarn queue



Insomnia Button

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=GymPoint&uri=https%3A%2F%2Fraw.githubusercontent.com%2FRodrigoSenna88%2FGoStack-Gympoint-backend%2Fmaster%2Fexport_data.json)