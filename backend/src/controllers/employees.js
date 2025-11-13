const pool = require('../utils/database');
const Joi = require('joi');

// handles GET /employees?cafe=
async function getEmployees(req, res) {
  const { cafe } = req.query;
    // obtain employees with cafe names and days worked
    let query = `
        SELECT e.*, c.name AS cafe_name, (CURRENT_DATE - e.start_date) AS days_worked
        FROM employees e
        LEFT JOIN cafes c ON e.cafe_id = c.id
    `;
    const values = [];
    
    // look for cafe with provided name
    if (cafe) {
        query += ' WHERE c.name = $1 ';
        values.push(cafe);
    }
    // order by days worked in descending order
    query += ' ORDER BY days_worked DESC';

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// handles POST /employees
async function createEmployee(req, res) {
    // validates data using Joi schema
    const schema = Joi.object({
        id: Joi.string().length(9).optional(),
        name: Joi.string().min(3).max(70).required(),
        email_address: Joi.string().email().required(),
        phone_number: Joi.string().pattern(/^[89]\d{7}$/).required(),
        gender: Joi.string().valid('Male','Female').required(),
        start_date: Joi.date().required(),
        cafe_id: Joi.string().uuid().optional()
    });

    const { error, value } = schema.validate(req.body || {}, { abortEarly: false, stripUnknown: true });
    if (error) {
        const messages = error.details.map(d => d.message);
        return res.status(400).json({ error: messages.join('; '), details: messages });
    }

    // generate an id if not provided (9 chars)
    let { id, name, email_address, phone_number, gender, start_date, cafe_id } = value;
    if (!id) {
        const generated = String(Date.now()).slice(-9);
        id = generated.padStart(9, '0');
    }

    try {
        // allow null cafe_id
        if (!cafe_id) cafe_id = null;
        const result = await pool.query(
            'INSERT INTO employees (id, name, email_address, phone_number, gender, start_date, cafe_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [id, name, email_address, phone_number, gender, start_date, cafe_id]
        );
        res.json(result.rows[0]);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

// handles PUT /employees/:id
async function updateEmployee(req, res) {
    const { id } = req.params;
    const { name, email_address, phone_number, gender, start_date, cafe_id } = req.body;
    try {
        const result = await pool.query(
            'UPDATE employees SET name = $1, email_address = $2, phone_number = $3, gender = $4, start_date = $5, cafe_id = $6 WHERE id = $7 RETURNING *',
            [name, email_address, phone_number, gender, start_date, cafe_id, id]
        );
        res.json(result.rows[0]);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

// handles DELETE /employees/:id
async function deleteEmployee(req, res) {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM employees WHERE id = $1', [id]);
        res.json({ message: 'Employee deleted', id });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getEmployees, createEmployee, updateEmployee, deleteEmployee };
