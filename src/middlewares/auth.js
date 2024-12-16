import jwt from "jsonwebtoken";
import authConfig from "../config/auth.json" assert { type: "json" };

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).send({ error: 'No token provided' });

    const parts = authHeader.split(' ');

    if (!parts.length === 2)
        return res.status(401).send({ error: 'Token error' });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).send({ error: 'Token mal formatado' });

    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalido' });

        // req.userId = decoded.id;
        const { email, admin, id } = decoded;
        console.log(`Email: ${email}, Admin: ${admin}, ID: ${id}`);

        // Armazenar o payload na requisição para uso em outros lugares (se necessário)
        req.user = decoded;
        return next();
    })

}

export default authMiddleware;