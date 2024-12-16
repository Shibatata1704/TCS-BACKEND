import { db } from "../config/db.js";
import { httpStatusCodes } from "../responseHandlers/statusCode.js";
import getToken from "../utils/getToken.js"


class UserController {
  static addUser(req, res) {
    const { nome, email, senha } = req.body;

    // Verifica se o e-mail já existe no banco
    const query = 'SELECT * FROM user WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error("Erro ao verificar o usuário: ", err);
        return res.status(500).json({ message: 'Erro ao verificar usuário.' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'E-mail já cadastrado.' });
      }

      // Se não existe, insere o novo usuário
      const insertQuery = 'INSERT INTO user (nome, email, senha, admin) VALUES (?, ?, ?, ?)';
      db.query(insertQuery, [nome, email, senha, false], (err) => {
        if (err) {
          console.error("Erro ao cadastrar usuário: ", err);
          return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
        }

        res.status(201).json({ message: "Usuario criado com sucesso" });
      });
    });
  };

  static getUsers = (_, res) => {
    const q = "SELECT * FROM user";

    db.query(q, (err, data) => {
      if (err) return res.json(err);

      return res.status(200).json(data);
    });
  };

  static getUserByEmail = (req, res) => {
    const { email } = req.params;
    const tokenData = getToken(req);

    // Verifica se o tokenData é válido antes de continuar
    if (!tokenData || !tokenData.token) {
      return res.status(httpStatusCodes.ERROR).json({ message: "Não autenticado" });
    }

    const token = tokenData.token;

    if (!token) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        message: "Token não fornecido no corpo da requisição."
      });
    }

    // Verifica se o token existe na whitelist (ou qualquer outra verificação que você tenha)
    const query = "SELECT * FROM whitelist WHERE token = ?";
    db.query(query, [token], (err, results) => {
      if (err) {
        console.error("Erro ao verificar token na whitelist:", err);
        return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Erro ao processar a requisição."
        });
      }

      if (results.length === 0) {
        // Se o token não for encontrado na whitelist
        return res.status(httpStatusCodes.NOT_FOUND).json({
          message: "Token não encontrado na whitelist."
        });
      }
    })
    
    const q = "SELECT * FROM user WHERE email = ?";

    db.query(q, [email], (err, results) => {
      if (err) return res.json(err);

      return res.status(200).json(results[0]);
    });
  };

  static updateUser = (req, res) => {
    const { email } = req.params; // Recupera o email da URL
    const { nome, senha } = req.body;
    const tokenData = getToken(req);

    // Verifica se o tokenData é válido antes de continuar
    if (!tokenData || !tokenData.token) {
      return res.status(httpStatusCodes.ERROR).json({ message: "Não autenticado" });
    }

    const token = tokenData.token;  // Recupera o token enviado no corpo da requisição

    if (!token) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        message: "Token não fornecido no corpo da requisição."
      });
    }

    // Verifica se o token existe na whitelist (ou qualquer outra verificação que você tenha)
    const query = "SELECT * FROM whitelist WHERE token = ?";
    db.query(query, [token], (err, results) => {
      if (err) {
        console.error("Erro ao verificar token na whitelist:", err);
        return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Erro ao processar a requisição."
        });
      }

      if (results.length === 0) {
        // Se o token não for encontrado na whitelist
        return res.status(httpStatusCodes.NOT_FOUND).json({
          message: "Token não encontrado na whitelist."
        });
      }
    })
    
    const q =
      `UPDATE user 
      SET nome = ?, senha = ?
      WHERE email = ?;`;

    db.query(q, [nome, senha, email], (err, results) => {  // Alterei 'result' para 'results'
      if (err) {
        console.error("Erro ao atualizar o usuário:", err);
        return res.status(500).json({ message: "Erro ao atualizar usuário." });
      }

      // Verifica se nenhuma linha foi afetada, ou seja, o usuário não foi encontrado
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Retorna os dados atualizados
      res.status(200).json({ nome, email, senha });
    });
  };


  static deleteUser = (req, res) => {
    const tokenData = getToken(req);

    // Verifica se o tokenData é válido antes de continuar
    if (!tokenData || !tokenData.token) {
      return res.status(httpStatusCodes.ERROR).json({ message: "Não autenticado" });
    }

    const token = tokenData.token;  // Recupera o token enviado no corpo da requisição

    if (!token) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        message: "Token não fornecido no corpo da requisição."
      });
    }

    // Verifica se o token existe na whitelist (ou qualquer outra verificação que você tenha)
    const query = "SELECT * FROM whitelist WHERE token = ?";
    db.query(query, [token], (err, results) => {
      if (err) {
        console.error("Erro ao verificar token na whitelist:", err);
        return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "Erro ao processar a requisição."
        });
      }

      if (results.length === 0) {
        // Se o token não for encontrado na whitelist
        return res.status(httpStatusCodes.NOT_FOUND).json({
          message: "Token não encontrado na whitelist."
        });
      }
    })
    
    const q = "DELETE FROM user WHERE `email` = ?";

    db.query(q, [req.params.email], (err) => {
      if (err) return res.json(err);

      return res.status(200).json("Usuário deletado com sucesso.");
    });
  };
};


export default UserController