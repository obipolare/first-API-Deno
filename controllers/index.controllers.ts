import { Request, Response, Body } from "https://deno.land/x/oak/mod.ts";
import { uuid } from "https://deno.land/x/uuid/mod.ts";

interface User {
  id: string;
  name: string;
}
let users: User[] = [
  {
    id: "1",
    name: "Ryan Dahl",
  },
];

const getUsers = ({ response }: { response: Response }) => {
  response.body = {
    message: "successfull query",
    users,
  };
};
const getUser = ({
  params,
  response,
}: {
  params: { id: string };
  response: Response;
}) => {
  const userFound = users.find((el) => el.id === params.id);
  if (userFound) {
    response.status = 200;
    response.body = {
      message: "Your got a single user",
      userFound,
    };
  } else {
    response.status = 404;
    response.body = {
      message: "user not found",
    };
  }
};

const createUser = async ({
  request,
  response,
}: {
  request: Request;
  response: Response;
}) => {
  const body: Body = await request.body();
  console.log(body);

  if (!request.hasBody) {
    response.status = 404;
    response.body = {
      message: "body is required",
    };
  } else {
    const newUser: User = await body.value;
    newUser.id = uuid();

    users.push(newUser);

    response.status = 200;

    response.body = {
      message: "new user created",
      newUser,
    };
  }
};
const updateUser = async ({
  request,
  response,
  params,
}: {
  request: Request;
  response: Response;
  params: { id: string };
}) => {
  const userFound = users.find((user) => user.id === params.id);
  if (!userFound) {
    response.status = 404;
    response.body = {
      message: "user not found",
    };
  } else {
    const body = await request.body();
    const updatedUser = await body.value;

    users = users.map((user) =>
      user.id === params.id ? { ...user, ...updatedUser } : user
    );
    response.status = 200;
    response.body = {
      users,
    };
  }
};
const deleteUser = ({
  params,
  response,
}: {
  params: { id: string };
  response: Response;
}) => {
  users = users.filter((user) => user.id !== params.id);
  response.status = 200;
  response.body = {
    message: "success delete user",
    users,
  };
};

export { getUsers, getUser, createUser, updateUser, deleteUser };
