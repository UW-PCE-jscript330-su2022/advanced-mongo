module.exports = {
  ok: 200, // all is well
  badRequest: 400, // server cannot or will not process the request due to something that is perceived to be a client error
  unauthorized: 401, // unauthenticated
  forbidden: 403, // client does not have access rights to the content
  notFound: 404, // server can not find the requested resource
  internalServerError: 500, // server has encountered a situation it does not know how to handle
};
