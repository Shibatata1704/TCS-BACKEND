import { db } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import { httpStatusCodes } from "../responseHandlers/statusCode.js";
import getToken from "../utils/getToken.js"
import createToken from "../utils/createToken.js"


class AuthController {

    // escolho cadastro como usuario => pag de cadastro como usuario => insiro email e dados => chama o cadastro/candidato no back => guarda no banco user 
    // idem pra empresa 

    // login => 


        static async loginUser(req, res) {
            const { email, senha } = req.body;
            const query = "SELECT * FROM user WHERE email = ?";
            console.log(email, senha);
        
            // Querying the db
            db.query(query, [email], (err, result) => {

        
                if (err) {
                    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao consultar o banco de dados.", err });
                }
        
                // Check if the user was found
                if (result.length === 0) {
                    return res.status(httpStatusCodes.UNAUTHORIZED).json({ message: "Usuário não encontrado." });
                }
                console.log(senha, result[0].senha)
                // Verify if the password matches
                bcrypt.compare(senha, result[0].senha, (err, isMatch) => {
                    if (err) {
                        return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao verificar a senha." });
                    }
        
                    

                    // User authenticated, generate JWT token
                    const userId = result[0].id;  // Assuming the 'id' field in the result is the user ID
                    const token = createToken(email, !!result[0].admin);  // Adjust 'isAdmin' or another property as needed
                    console.log(!!result[0].admin);
        
                    // Insert the token into the whitelist
                    const insertQuery = "INSERT INTO whitelist (email_usuario, token) VALUES (?, ?)";
                    db.query(insertQuery, [email, token], (err) => {
                        if (err) {
                            return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Erro ao inserir token na whitelist." });
                        }
        
                        // Respond with the token and user email
                        return res.status(httpStatusCodes.OK).json({
                            token: token,
                        });
                    });
                });
            });
        }
        
    // const { email, senha } = req.body;
    // console.log("1")
    // try {
    //     if (!validator.isEmail(email))
    //         return res.status(httpStatusCodes.INVALID_DATA).json({ message: "E-mail invalido" });

    //     // fazer verificao se a senha é so numero com tamanho de min 3 e max 6 e nome minimo 3
    //     // const q =
    //     const querry = `select * FROM user WHERE email =  "?"  AND senha = "?" `

    //     db.query(querry, [email, senha], (err, result) => {
    //         console.log(result)
    //         if (err) return res.status(httpStatusCodes.ERROR).json({ message: "erro" });
    //         if (result.length === 1) {
    //             return res.status(httpStatusCodes.INVALID_DATA).json({ message: "Usuario  Ja Autentificado." });
    //         }
    //     })
    //     const token = jwt.sign({ email: email }, process.env.JWT_KEY, {
    //         expiresIn: "15min",
    //     });
    //     console.log(token)
    //     const insert = "INSERT INTO whitelist (email_usuario,token) VALUES(?, ?)";;
    //     db.query(insert, [email, token], (err) => {
    //         if (err) return res.status(httpStatusCodes.ERROR).json({ err });
    //         return res.status(httpStatusCodes.OK).json({
    //             token,
    //             email: email,
    //             admin: result.admin
    //             // Outras informações do usuário, se necessário
    //         });

    //         // if (!await bcrypt.compare(senha, user.senha)) {
    //         //     res.status(httpStatusCodes.ERROR).json({ message: "erro" });
    //         // }

    //         // let isUserLogged = await AuthModel.findOne({ email });

    //         // user.senha = undefined;
    //         // let isUserLogged
    //         // if (isUserLogged) {
    //         //     const query = "UPDATE users SET token = ?, email = ? ";
    //         //     await db.query(updateOne, [email, token, id], (err, results) => {
    //         //     });
    //         // } else {

    //         //     isUserLogged = await AuthModel.create({ email, token })
    //         // }    

    //     })
    //     // });
    // } catch (erro) {
    //     res.status(httpStatusCodes.ERROR).json({ message: `${erro.message}` });
    // }
    // };


    static async logout(req, res) {
        try {
            // Recuperando o token da requisição
            const tokenData = getToken(req);

            // Verifica se o tokenData é válido antes de continuar
            if (!tokenData || !tokenData.token) {
                return res.status(httpStatusCodes.ERROR).json({ message: "Não autenticado" });
            }

            const token = tokenData.token;

            // A consulta SQL para deletar o token da tabela whitelist
            const q = "DELETE FROM whitelist WHERE `token` = ?";

            // Executando a consulta no banco de dados
            db.query(q, [token], (err, results) => {
                if (err) {
                    console.error("Erro ao remover o token:", err);
                    return res.status(httpStatusCodes.ERROR).json({ error: err.message });
                }

                // Se nenhuma linha for afetada, o token não foi encontrado na whitelist
                if (results.affectedRows === 0) {
                    return res.status(httpStatusCodes.NOT_FOUND).json({ message: "Token não encontrado na whitelist" });
                }

                // Retorna uma mensagem de sucesso após a remoção do token
                return res.status(httpStatusCodes.OK).json({ message: "Usuário deslogado com sucesso" });
            });
        } catch (erro) {
            // Captura erros gerais
            console.error("Erro no processo:", erro);
            return res.status(httpStatusCodes.ERROR).json({ message: `${erro.message}` });
        };

        // static async checkWhitelist(req, res) {
        //     try {
        //         const users = await AuthModel.find({});
        //         res.status(200).json(users);
        //     } catch (erro) {
        //         res.status(500).json({ message: `${erro.message} - falha na requisição` });
        //     }
        // };
    };
}

export default AuthController;
