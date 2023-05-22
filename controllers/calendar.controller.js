const postgres = require("postgres");
const { isLoggedIn } = require("../middleware/isLoggedIn");
require("dotenv").config();

const URL = process.env.POSTGRES_URL;

const sql = postgres(URL, { ssl: "require" });

exports.calendar__get = [
  isLoggedIn,
  async (req, res) => {
    try {
      const query = sql`SELECT * FROM calendar`; // Replace `your_table_name` with the actual name of your table
      const items = await query;

      return res.json({ items });
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving items from the table");
    }
  },
];
