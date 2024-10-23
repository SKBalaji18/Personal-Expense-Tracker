const express = require('express')
const app = express()

const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')


app.use(express.json())

const dbPath = path.join(__dirname, 'transactions.db')
let db = null

const initializeDBAndServer = async() => {
    try {
        db = await open({
          filename: dbPath,
          driver: sqlite3.Database,
        })

        await db.run(`CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            description TEXT
        )`);

        await db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL
        )`);
        app.listen(3000, () => {
          console.log('Server Started at http://localhost:3000')
        })
    } catch (e) {
        console.log(`DB Error: ${e.message}`)
        process.exit(1)
    }
}
    
initializeDBAndServer()

app.get('/', (req, res) => {
    try{
        res.send('API is running!');
    }catch(err){
        console.error('Error fetching user details:', err);
        return res.status(400).json({ error: err.message }); 
    }
    
});

// POST /transactions
app.post('/transactions', async (req, res) => {
    try{
        const { type, category, amount, date, description } = req.body;
        const sql = `INSERT INTO transactions (type, category, amount, date, description) VALUES ('${type}', '${category}', ${amount}, '${date}', '${description}')`;
        const result = await db.run(sql)
        res.status(201).json({ id: result.lastID, type, category, amount, date, description });
    }catch(err){
        return res.status(400).json({ error: err.message });
    }
});

// GET /transactions
app.get('/transactions', async(req, res) => {
    try{
        const sql = `SELECT * FROM transactions`;
        const transactionList = await db.all(sql) 
        if (transactionList.length === 0) {
            return res.status(404).json({message:"'No transactions found'"});
          }
        res.status(201).json(transactionList);
    }catch(err){
        return res.status(400).json({ error: err.message });
    }
});

// GET /transactions/:id
app.get('/transactions/:id', async (req, res) => {
    try{
        const {id} = req.params
        const sql = `SELECT * FROM transactions WHERE id = ${id}`;
        const result = await db.get(sql)
        if (!result) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        res.status(201).json(result);
    }catch(err){
        return res.status(400).json({ error: err.message });
    }
});

// PUT /transactions/:id
app.put('/transactions/:id', async(req, res) => {
    try{
        const { type, category, amount, date, description } = req.body;
        const {id} = req.params
        const sql = `SELECT * FROM transactions WHERE id = ${id}`;
        const result = await db.get(sql)
        if (!result) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        
        let transactionUpdate = ''
        if (type !== undefined){
            transactionUpdate = `
                UPDATE transactions SET
                type = '${type}'
                WHERE id = ${id}`
            await db.run(transactionUpdate)
        }
        if (category !== undefined){
            transactionUpdate = `
                UPDATE transactions SET
                category = '${category}'
                WHERE id = ${id}`
            await db.run(transactionUpdate)
        }
        if (amount !== undefined){
            transactionUpdate = `
                UPDATE transactions SET
                amount = ${amount}
                WHERE id = ${id}`
            await db.run(transactionUpdate)
        }
        if (date !== undefined){
            transactionUpdate = `
                UPDATE transactions SET
                date = '${date}'
                WHERE id = ${id}`
            await db.run(transactionUpdate)
        }
        
        if (description !== undefined){
            transactionUpdate = `
                UPDATE transactions SET
                description = '${description}'
                WHERE id = ${id}`
            await db.run(transactionUpdate)
        }
        
        res.status(201).json({message:"Transactions Details Updated "});
    }catch(err){
        return res.status(400).json({ error: err.message });
    }
});

// DELETE /transactions/:id
app.delete('/transactions/:id', async (req, res) => {
    try{
        const {id} = req.params
        const sql = `SELECT * FROM transactions WHERE id = ${id}`;
        const result = await db.get(sql)
        if (!result) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        const deleteQuery = `DELETE FROM transactions WHERE id = WHERE id = ${id}`;
        await db.run(deleteQuery)
        res.status(201).json({message:"Transactions Details Deleted "});
    }catch(err){
        return res.status(400).json({ error: err.message });
    }
});

// GET /summary
app.get('/summary', async(req, res) => {
    try{
        const sql = `SELECT 
                    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
                    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses
                FROM transactions`;
        const summaryQuery = await db.get(sql)
            if (!summaryQuery) {
                return res.status(400).json({ error: "Transaction not found" });
            }
            const balance = summaryQuery.total_income - summaryQuery.total_expenses;
            res.status(201).json({ total_income: summaryQuery.total_income, total_expenses: summaryQuery.total_expenses, balance });
    }catch(err){
        return res.status(400).json({ error: err.message });
    }
});



