// eslint-disable-next-line no-shadow
enum HttpStatusCodes {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  UNPROCESSABLE_ENTITY = 422,
  NOT_FOUND = 404,
  SERVER_INTERNAL_ERROR = 500,
  BAD_GATEWAY = 502,
}

export default HttpStatusCodes;
