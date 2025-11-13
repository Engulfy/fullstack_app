const pool = require('../utils/database');
const Joi = require('joi');

// handles GET /cafes?location= 
async function getCafes(req, res) {
    // retrieve query loation
    const { location } = req.query;
    // query to get all cafes with employee counts
    let query = `
        SELECT c.*, COUNT(e.id) AS employees
        FROM cafes c
        LEFT JOIN employees e ON c.id = e.cafe_id
    `;
    const values = [];
    // if location is provided, add condition
    if (location) {
        query += ' WHERE c.location = $1 ';
        values.push(location);
    }
    query += ' GROUP BY c.id ORDER BY employees DESC';

    try {
        // awaits response from query of database
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch(err) {
        // print error message if error occurs
        res.status(500).json({ error: err.message });
    }
}

// handles POST /cafes
async function createCafe(req, res) {
    const schema = Joi.object({
        // validation rules present
        name: Joi.string().min(2).max(70).required(),
        description: Joi.string().max(300).required(),
        location: Joi.string().required(),
        // allow empty string or null for logo (frontend may send empty string)
        logo: Joi.string().allow('', null).optional()
    });

    // stores validation result (guard against undefined body)
    const { error, value } = schema.validate(req.body || {}, { abortEarly: false, stripUnknown: true });
    if (error) {
        // return array of messages for frontend to display or map
        const messages = error.details.map(d => d.message);
        return res.status(400).json({ error: messages.join('; '), details: messages });
    }

    // Obtain validated data
    let { name, description, location, logo } = value;
    // normalize empty logo to null for DB
    if (logo === '') logo = null;
    try {
        const result = await pool.query(
            'INSERT INTO cafes (name, description, location, logo) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, description, location, logo]
        );
        res.json(result.rows[0]);
    } catch(err) {
        //priot error message if error occurs
        res.status(500).json({ error: err.message });
    }
}

// handles PUT /cafes/:id
async function updateCafe(req, res) {
    // obtained cafe id from request parameters
    const { id } = req.params;
    let { name, description, location, logo } = req.body || {};
    if (logo === '') logo = null;
    try {
        const result = await pool.query(
            'UPDATE cafes SET name = $1, description = $2, location = $3, logo = $4 WHERE id = $5 RETURNING *',
            [name, description, location, logo, id]
        );
        res.json(result.rows[0]);
    } catch(err) {
        // prints error message if error occurs
        res.status(500).json({ error: err.message });
    }
}

// handles DELETE /cafes/:id
async function deleteCafe(req, res) {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM cafes WHERE id = $1', [id]);
        res.json({ message: 'Deleted cafe', id });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getCafes, createCafe, updateCafe, deleteCafe };
