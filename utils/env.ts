let baseUrl = (env => {
  switch (env) {
    case "production":
      return "https://n1trivia.herokuapp.com";
    default:
      return "http://localhost:3000";
  }
})(process.env.NODE_ENV);

export const BASE_URL = baseUrl;
