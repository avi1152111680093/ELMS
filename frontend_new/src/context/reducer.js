let user = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")).user
  : "";
let access_token = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")).auth_access_token
  : "";
let refresh_token = localStorage.getItem("currentUser")
  ? JSON.parse(localStorage.getItem("currentUser")).auth_refresh_token
  : "";

export const initialState = {
  user: "" || user,
  access_token: "" || access_token,
  refresh_token: "" || refresh_token,
  loading: false,
  errorMessage: null,
};

export const AuthReducer = (initialState, action) => {
  switch (action.type) {
    case "REQUEST_LOGIN":
      return {
        ...initialState,
        loading: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...initialState,
        user: action.payload.user,
        access_token: action.payload.auth_access_token,
        refresh_token: action.payload.auth_refresh_token,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...initialState,
        user: "",
        access_token: "",
        refresh_token: "",
      };

    case "LOGIN_ERROR":
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error,
      };

    case "UPDATE_USER_DETAILS":
      return {
        ...initialState,
        user: action.payload.user,
        access_token: action.payload.auth_access_token,
        refresh_token: action.payload.auth_refresh_token,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
