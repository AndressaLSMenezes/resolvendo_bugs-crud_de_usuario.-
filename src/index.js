import express from "express";
import { v4 as uuidv4 } from "uuid";
import users from "./database";

const app = express();
const port = 3000;

app.use(express.json());

// Services
const createUserService = (product) => {
  const userArealdyExists = users.find((user) => user.email === product.email);

  if (userArealdyExists) {
    return [409, { error: "This email address is already being used" }];
  }

  const newUser = {
    ...product,
    id: uuidv4(),
  };

  users.push(newUser);

  return [201, newUser];
};

const listUsersService = () => {
  return users;
};

// Controllers
const createUserController = (request, response) => {
  console.log(request.body);
  const [status, product] = createUserService(request.body);

  return response.status(status).json(product);
};

const listUsersController = (request, response) => {
  const usersList = listUsersService();

  return response.json(users);
};

const deleteUserController = (request, response) => {
  const { id } = request.body;

  const userIndex = users.findIndex((element) => element.id === id);

  if (userIndex === -1) {
    return response.status(404).json("User not found");
  }

  users.splice(userIndex, 1);

  return response.json("Usuário excluido");
};

app.post("/", (request, response) => createUserController(request, response));
app.get("/", listUsersController);
app.delete("/id", deleteUserController);

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});

export default app;
