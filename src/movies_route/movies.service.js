const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

const addCritic = reduceProperties("critic_id", {
  preferred_name: ["critic", "preferred_name"],
  surname: ["critic", "surname"],
  organization_name: ["critic", "organization_name"],
});

function addReviews(movieId) {
  return knex("reviews as r")
    .join("critics as c", "c.critic_id", "r.critic_id")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.created_at",
      "r.updated_at",
      "r.critic_id",
      "r.movie_id",
      "c.critic_id",
      "c.preferred_name",
      "c.surname",
      "c.organization_name",
      "c.created_at",
      "c.updated_at"
    )
    .groupBy("r.review_id", "c.critic_id")
    .where({ "r.movie_id": movieId })
    .then(addCritic);
}

function inTheaters(movieId) {
  return knex("movies_theaters as mt")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("*")
    .where({ movie_id: movieId, is_showing: true });
}

function isShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .groupBy("m.movie_id");
}

function read(movieId) {
  return knex("movies").select("*").where({ movie_id: movieId }).first();
}

function list() {
  return knex("movies").select("*");
}

module.exports = {
  addReviews,
  isShowing,
  inTheaters,
  read,
  list,
};
