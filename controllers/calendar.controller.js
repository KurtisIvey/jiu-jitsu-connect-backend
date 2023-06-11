const postgres = require("postgres");
const { body, validationResult, express, check } = require("express-validator");

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
exports.calendarRange__post = [
  body("fromDate")
    .trim()
    .isISO8601()
    .withMessage("Invalid date format. Expected format: YYYY-MM-DD"),
  body("toDate")
    .trim()
    .isISO8601()
    .withMessage("Invalid date format. Expected format: YYYY-MM-DD"),
  /*   isLoggedIn,
   */ async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
      console.log("error");
    }
    try {
      const fromDate = req.body.fromDate;
      const toDate = req.body.toDate;

      const query = sql`
        SELECT * FROM calendar
        WHERE date_column >= ${fromDate} AND date_column <= ${toDate}
      `;
      const items = await query;

      return res.json({ items });
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving items from the table");
    }
  },
];

exports.calendar__post = [
  body("fromDate")
    .trim()
    .isISO8601()
    .withMessage("Invalid date format. Expected format: YYYY-MM-DD"),
  /* isAdmin, */
  body("description").trim().blacklist(regex).notEmpty(),
  async (req, res) => {
    // Check if express validator fails
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }

    try {
      const { date, description } = req.body;

      // Insert the calendar event into the database
      // have express validator implemented to prevent direct injection
      const result = await sql`
      INSERT INTO calendar (date_column, description)
      VALUES (${date}, ${description})
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
