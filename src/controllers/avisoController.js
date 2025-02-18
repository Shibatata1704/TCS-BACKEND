import { db } from "../config/db.js";
import { httpStatusCodes } from "../responseHandlers/statusCode.js";
import getToken from "../utils/getToken.js"


class AvisosController {
  static addAvisos(req, res) {
    console.log(req.body)
    const {descricao, idCategoria} = req.body;
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
    const insertQuery = 'INSERT INTO avisos (descricao, idCategoria) VALUES (?, ?)';
      db.query(insertQuery, [descricao, idCategoria, ], (err) => {
        if (err) {
          console.error("Erro ao cadastrar categoria: ", err);
          return res.status(500).json({ message: 'Erro ao cadastrar categoria.' });
        }

        res.status(201).json({ message: "Categoria criado com sucesso" });
      });
  };

  static getAvisos = (_, res) => {
    const q = "SELECT * FROM avisos";

    db.query(q, (err, data) => {
      if (err) return res.json(err);

      return res.status(200).json(data);
    });
  };

  // static getAvisosByID = (req, res) => {
  //   const {id} = req.params;
  //   const tokenData = getToken(req);
  //   // Verifica se o tokenData é válido antes de continuar
  //   if (!tokenData || !tokenData.token) {
  //     return res.status(httpStatusCodes.ERROR).json({ message: "Não autenticado" });
  //   }

  //   const token = tokenData.token;

  //   if (!token) {
  //     return res.status(httpStatusCodes.BAD_REQUEST).json({
  //       message: "Token não fornecido no corpo da requisição."
  //     });
  //   }

  //   // Verifica se o token existe na whitelist (ou qualquer outra verificação que você tenha)
  //   const query = "SELECT * FROM whitelist WHERE token = ?";
  //   db.query(query, [token], (err, results) => {
  //     if (err) {
  //       console.error("Erro ao verificar token na whitelist:", err);
  //       return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
  //         message: "Erro ao processar a requisição."
  //       });
  //     }

  //     if (results.length === 0) {
  //       // Se o token não for encontrado na whitelist
  //       return res.status(httpStatusCodes.NOT_FOUND).json({
  //         message: "Token não encontrado na whitelist."
  //       });
  //     }
  //   })
    
  //   const q = "SELECT * FROM avisos WHERE id = ?";

  //   db.query(q, [id], (err, results) => {
  //     if (err) return res.json(err);
  
  //     // Filtra para retornar apenas os campos 'id' e 'descricao'
  //     const filteredResults = results.map(result => ({
  //       id: result.id,
  //       descricao: result.descricao
  //     }));
  //     console.log(filteredResults)
  //     return res.status(200).json(filteredResults);
  //   });
  // };

  static getAvisosByIDCategoria = (req, res) => {
    const {idCategoria} = req.params;
    const tokenData = getToken(req);
    console.log(idCategoria)
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
    
    const q = "SELECT * FROM avisos WHERE idCategoria = ?";

    db.query(q, [idCategoria], (err, results) => {
      if (err) return res.json(err);
  
      // Filtra para retornar apenas os campos 'id' e 'descricao'
      const filteredResults = results.map(result => ({
        id: result.id,
        descricao: result.descricao
      }));
      console.log(filteredResults)
      return res.status(200).json(filteredResults);
    });
  };

  static updateAvisos = (req, res) => {
    const { id } = req.params; // Recupera o email da URL
    const { descricao } = req.body;
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
      `UPDATE avisos
      SET descricao = ?
      WHERE id = ?;`;

    db.query(q, [descricao, id], (err, results) => {  // Alterei 'result' para 'results'
      if (err) {
        console.error("Erro ao atualizar o categoria:", err);
        return res.status(500).json({ message: "Erro ao atualizar usuário." });
      }

      // Verifica se nenhuma linha foi afetada, ou seja, o usuário não foi encontrado
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      // Retorna os dados atualizados
      res.status(200).json({descricao});
    });
  };


  static deleteAvisos = (req, res) => {
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
    
    const q = "DELETE FROM avisos WHERE id = ?";

    db.query(q, [req.params.id], (err) => {
      if (err) return res.json(err);

      return res.status(200).json("Categoria deletada com sucesso.");
    });
  };
};


export default AvisosController