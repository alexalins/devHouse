import app from './app';

app.listen(process.env.PORT, () =>
  console.log(`Rodando em http://localhost:${process.env.PORT}`)
);
