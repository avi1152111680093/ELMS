export async function loginUser(dispatch, loginPayload) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...loginPayload,
    }),
  };

  try {
    dispatch({ type: "REQUEST_LOGIN" });
    let response = await fetch(
      "http://127.0.0.1:8000/accounts/login/",
      requestOptions
    );
    let data = await response.json();

    if (data.user) {
      let response2 = await fetch(
        "http://127.0.0.1:8000/accounts/token/",
        requestOptions
      );
      let tokens = await response2.json();
      data = {
        ...data,
        auth_access_token: tokens.access,
        auth_refresh_token: tokens.refresh,
      };
      dispatch({ type: "LOGIN_SUCCESS", payload: data });
      localStorage.setItem("currentUser", JSON.stringify(data));
      return data;
    }
    dispatch({ type: "LOGIN_ERROR", error: data.errors[0] });
    return data;
  } catch (error) {
    dispatch({ type: "LOGIN_ERROR", error: error });
  }
}

export async function logout(dispatch, logoutPayload) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...logoutPayload,
    }),
  };

  fetch("http://127.0.0.1:8000/accounts/logout/", requestOptions)
    .then((res) => res.json())
    .then((data) => {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("currentUser");
      localStorage.removeItem("auth_access_token");
      localStorage.removeItem("auth_refresh_token");
      // logoutPayload.webSocket.close();
    });
}

export async function updateUser(dispatch, updateUserPayload) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...updateUserPayload,
    }),
  };

  let response = await fetch(
    "http://127.0.0.1:8000/accounts/get-user/",
    requestOptions
  );
  let user = await response.json();
  let data = {
    user,
    auth_access_token: JSON.parse(localStorage.getItem("currentUser"))
      .auth_access_token,
    auth_refresh_token: JSON.parse(localStorage.getItem("currentUser"))
      .auth_refresh_token,
  };
  dispatch({ type: "UPDATE_USER_DETAILS", payload: data });
  localStorage.setItem("currentUser", JSON.stringify(data));
}
