import mysql from 'mysql';

export const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // ou o seu usuário de banco de dados
  password: 'root',      // ou a senha correta
  database: 'api' // Verifique se o nome do banco de dados está correto
});

db.connect((err) => {
  if (err) {
    console.error('Erro de conexão ao banco de dados: ', err);
    return;
  }
  console.log('Conexão ao banco de dados estabelecida');
});

// CREATE TABLE `api`.`user` (
//     `id` INT NOT NULL AUTO_INCREMENT,
//     `nome` VARCHAR(45) NOT NULL,
//     `email` VARCHAR(45) NOT NULL,
//     `senha` VARCHAR(45) NOT NULL,
//     `admin` TINYINT NOT NULL,
//     PRIMARY KEY (`id`));
  
// CREATE TABLE `api`.`whitelist` (
//     `id_whitelist` INT NOT NULL AUTO_INCREMENT,
//     `email_usuario` VARCHAR(45) NULL,
//     `token` VARCHAR(200) NULL,
//     PRIMARY KEY (`id_whitelist`));
  
// CREATE TABLE usuarios (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     nome VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL UNIQUE,
//     senha VARCHAR(255) NOT NULL,
//     admin INT DEFAULT 0
//   );

// INSERT INTO user (nome, email, senha, admin) 
// VALUES ("admin", "admin@email.com", "123456",true);

// CREATE TABLE `api`.`categorias` (
//   `id` INT NOT NULL AUTO_INCREMENT,
//   `nome` VARCHAR(250) NOT NULL,
//   PRIMARY KEY (`id`));
