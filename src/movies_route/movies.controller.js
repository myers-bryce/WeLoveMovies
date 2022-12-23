const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(req, res, next) {
  const movie = await service.read(req.params.movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  next({ status: 404, message: "Movie cannot be found." });
}

async function inTheaters(req, res) {
  res.json({ data: await service.inTheaters(res.locals.movie.movie_id) });
}

async function addReviews(req, res) {
  const data = await service.addReviews(req.params.movieId);
  res.json({ data });
}

async function list(req, res) {
  if (req.query.is_showing) {
    res.json({ data: await service.isShowing() });
  }
  res.json({ data: await service.list() });
}

function read(req, res, next) {
  const { movie: data } = res.locals;
  res.json({ data });
}

module.exports = {
  read: [asyncErrorBoundary(movieExists), read],
  list: asyncErrorBoundary(list),
  inTheaters: [asyncErrorBoundary(movieExists), inTheaters],
  addReviews: [asyncErrorBoundary(movieExists), addReviews],
};
