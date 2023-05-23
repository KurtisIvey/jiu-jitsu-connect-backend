const postgres = require("postgres");
const { body, validationResult } = require("express-validator");

const { isLoggedIn } = require("../middleware/isLoggedIn");
require("dotenv").config();
const regex = /<>\$\/\|\[\]~`/;

const URL = process.env.POSTGRES_URL;

const sql = postgres(URL, { ssl: "require" });

exports.calendar__get = [
  /*   isLoggedIn,
   */ async (req, res) => {
    try {
      const query = sql`SELECT * FROM calendar`;
      const items = await query;

      return res.json({ items });
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving items from the table");
    }
  },
];

exports.calendar__post = [
  body("date")
    .trim()
    .isISO8601()
    .withMessage("Invalid date format. Expected format: YYYY-MM-DD"),
  body("time")
    .trim()
    .custom((value) => {
      // Regular expression to match the "HH:MM:SS" format
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      if (!timeRegex.test(value)) {
        throw new Error("Invalid time format. Expected format: HH:MM:SS");
      }
      return true;
    }),
  /* isAdmin, */

  body("description").trim().blacklist(regex).notEmpty(),
  async (req, res) => {
    // Check if express validator fails
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    try {
      const { date, time, description } = req.body;

      // Insert the calendar event into the database

      const result = await sql`
      INSERT INTO calendar (date_column, time_column, description)
      VALUES (${date}, ${time}, ${description})
      RETURNING id`;

      return res.status(200).json({
        message: "Calendar event added successfully",
        id: result[0].id, // Get the inserted ID
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
];

exports.calendar__delete = async (req, res) => {
  try {
    const { id } = req.params;
    // Check if the ID is provided
    if (!id) {
      return res.status(400).json({ message: "Calendar event ID is required" });
    }
    // Delete the calendar event from the database
    const query = {
      text: "DELETE FROM calendar WHERE id = $1",
      values: [id],
    };
    await sql.query(query);

    return res
      .status(200)
      .json({ message: "Calendar event deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
