const knex = require("../db/connection");
const reduceProperties = require("../utils/reduce-properties");

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

function update(updatedReview) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ review_id: updatedReview.review_id })
    .update(updatedReview, "*")
    .then((updatedFinal) => updatedFinal[0]);
}

function readWithCritic(review_id) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ review_id })
    .then(addCritic);
}

const addCritic = reduceProperties("critic_id", {
  preferred_name: ["critic", "preferred_name"],
  surname: ["critic", "surname"],
  organization_name: ["critic", "organization_name"],
});

function destroy(review_id) {
  return knex("reviews").where({ review_id }).del();
}

module.exports = {
  readWithCritic,
  read,
  update,
  delete: destroy,
};
