const getToken = (req) => {
  const authHeader = req.headers['authorization'];
  
  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Extrai o token do "Bearer <token>"
    return { token };
  }
  return null;  // Caso o token não esteja presente
  }

  export default getToken