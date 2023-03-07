import React, { useState } from "react";
import { users } from "../common/users";
import { User, UserInfo } from "../interfaces/User";

const _secret: string = "12345!!";

type LoginSuccessMessage = "SUCCESS";
type LoginFailMessage = "FAIL";

interface LoginResponse {
  message: LoginSuccessMessage | LoginFailMessage;
  token: string;
}

const login = async (
  username: string,
  password: string
): Promise<LoginResponse | null> => {
  // TODO: 올바른 username, password를 입력하면 {message: 'SUCCESS', token: (원하는 문자열)} 를 반환하세요.
  /**
   * users에 있는 user와 입력받은 user정보와 비교(username, password)하여 있으면 user 없으면 undefined
   */
  const user: User | undefined = users.find((user: User) => {
    return user.username === username && user.password === password;
  });

  /**
   * user정보와 secret 값을 JSON으로 변환
   */
  return user
    ? {
        message: "SUCCESS",
        token: JSON.stringify({ user: user.userInfo, secret: _secret }),
      }
    : null;
};

const getUserInfo = async (token: string): Promise<UserInfo | null> => {
  // TODO: login 함수에서 받은 token을 이용해 사용자 정보를 받아오세요.
  const parsedToken = JSON.parse(token);

  /**
   * secret이 없거나, 토큰이 일치하지 않을때 null 반환
   */
  if (!parsedToken?.secret || parsedToken.secret !== _secret) return null;

  /**
   * 토큰의 유저정보와 유저 목록의 유저정보가 일치하는지 확인
   */
  const signedUser: User | undefined = users.find((user: User) => {
    if (user.userInfo.name === parsedToken.user.name) return user;
  });

  return signedUser ? signedUser.userInfo : null;
};

const LoginWithMockAPI = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "" });

  const loginSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    // TODO: form 에서 username과 password를 받아 login 함수를 호출하세요.
    const formData = new FormData(event.currentTarget);

    const loginRes = await login(
      formData.get("username") as string,
      formData.get("password") as string
    );

    if (!loginRes) return;

    const userInfo = await getUserInfo(loginRes.token);

    if (!userInfo) return;

    setUserInfo(userInfo);
  };

  return (
    <div>
      <h1>Login with Mock API</h1>
      <form onSubmit={loginSubmitHandler}>
        <label>
          Username:
          <input type="text" name="username" />
        </label>
        <label>
          Password:
          <input type="password" name="password" />
        </label>
        <input type="submit" value="Submit" />
        {/* TODO: 여기에 username과 password를 입력하는 input을 추가하세요. 제출을 위해 button도 추가하세요. */}
      </form>
      <div>
        <h2>User info</h2>
        {/* TODO: 유저 정보를 보여주도록 구현하세요. 필요에 따라 state나 다른 변수를 추가하세요. */}
        {JSON.stringify(userInfo)}
      </div>
    </div>
  );
};

export default LoginWithMockAPI;
