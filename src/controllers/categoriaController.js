import { db } from "../config/db.js";
import { httpStatusCodes } from "../responseHandlers/statusCode.js";
import getToken from "../utils/getToken.js"


class CategoriasController {
  static addCategorias(req, res) {
    const {nome} = req.body;
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
    const qq = "SELECT * FROM whitelist WHERE token = ?";
    db.query(qq, [token], (err, results) => {
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

    // Verifica se o e-mail já existe no banco
    const query = 'SELECT * FROM categorias WHERE nome = ?';
    db.query(query, [nome], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao verificar nome' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'nome já cadastrado.' });
      }

      // Se não existe, insere o novo usuário
      const insertQuery = 'INSERT INTO categorias (nome) VALUES (?)';
      db.query(insertQuery, [nome], (err) => {
        if (err) {
          console.error("Erro ao cadastrar categoria: ", err);
          return res.status(500).json({ message: 'Erro ao cadastrar categoria.' });
        }

        res.status(201).json({ message: "Categoria criado com sucesso" });
      });
    });
  };

  static getCategorias = (_, res) => {
    const q = "SELECT * FROM categorias";

    db.query(q, (err, data) => {
      if (err) return res.json(err);

      return res.status(200).json(data);
    });
  };

  static getCategoriasByID = (req, res) => {
    const { id } = req.params;
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
    
    const q = "SELECT * FROM categorias WHERE id = ?";

    db.query(q, [id], (err, results) => {
      if (err) return res.json(err);

      return res.status(200).json(results[0]);
    });
  };

  static updateCategorias = (req, res) => {
    const { id } = req.params; // Recupera o email da URL
    const { nome } = req.body;
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
      `UPDATE categorias
      SET nome = ?
      WHERE id = ?;`;

    db.query(q, [nome, id], (err, results) => {  // Alterei 'result' para 'results'
      if (err) {
        console.error("Erro ao atualizar o categoria:", err);
        return res.status(500).json({ message: "Erro ao atualizar usuário." });
      }

      // Verifica se nenhuma linha foi afetada, ou seja, o usuário não foi encontrado
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Retorna os dados atualizados
      res.status(200).json({ nome, id});
    });
  };


  static deleteCategorias = (req, res) => {
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
    
    const q = "DELETE FROM categorias WHERE `id` = ?";

    db.query(q, [req.params.id], (err) => {
      if (err) return res.json(err);

      return res.status(200).json("Categoria deletada com sucesso.");
    });
  };
};


export default CategoriasController