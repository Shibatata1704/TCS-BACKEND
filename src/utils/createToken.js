import jwt from 'jsonwebtoken';  // Importe a biblioteca jsonwebtoken

const createToken = (email, isAdmin) => {
  // Crie o payload contendo o email e o status de admin
  const payload = {
    email: email,       // E-mail do usuário        
    admin: isAdmin,      // Status de admin (true ou false)
    exp: Math.floor(Date.now() / 1000) + (15 * 60)
  };

  // Defina o segredo para assinar o token (você pode usar uma variável de ambiente para segurança)
//   const segredo = process.env.JWT_KEY || 'seuSegredoAqui';  // Alterar para a chave do seu ambiente

  // Defina as opções para o token (expiração, por exemplo)
//   const opcoes = {
//     expiresIn: '15min',  // Define o tempo de expiração do token
//   };

  // Gere o JWT assinando o payload com o segredo
  const token = jwt.sign(payload, process.env.JWT_KEY);

  return token;  // Retorne o token gerado
};


export default createToken;
// Exemplo de uso
// const email = 'usuario@example.com';
// const id = 123;  // ID do usuário no banco de dados
// const isAdmin = true;  // Defina como true ou false

// const token = gerarToken(email, id, isAdmin);
// console.log(token);  // Exibe o token gerado
