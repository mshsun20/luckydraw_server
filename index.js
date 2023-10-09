const express = require('express')
const dotenv = require('dotenv')
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require('multer')

const app = express()
dotenv.config({path:'config.env'})


// middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())
app.use(express.static('uploads'))

// env variables
const port = process.env.PORT || 5000
const host = process.env.HOST || 'localhost'
const user = process.env.USER || 'root'
const password = process.env.PASSWORD || ''
const database = process.env.DATABASE || 'luckydrawdb'


// image storage setup
const imgconfig = multer.diskStorage({
    destination: (req,file,callback) => {
        callback(null, 'uploads')
    },
    filename: (req,file,callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`)
    }
})
const isImage = (req,file,callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true)
    }
    else {
        callback(null, Error(`Only image File is Allowed.`))
    }
}
const upload = multer({
    storage: imgconfig,
    fileFilter: isImage
})

// listening to server
app.listen(port,host, (req, res) => {
    console.log(`Server is Running at http://${host}:${port}`)
})

// DB Connection
const conn = mysql.createConnection({
    host, user, password, database, multipleStatements: true
})
conn.connect((err) => {
    if (err) throw err
    console.log('Successfully Connected to Database...')
})



// Routing
// ------------------------------------------------------------------------------
// app.get('/', (req, res) => {
//     res.send('Server is Online...')
// })

// Account api
// read
app.get('/viewacc', (req, res) => {
    const sql = `select * from account`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json(result)
    })
})
app.get('/viewacc/:id', (req, res) => {
    const acc_no = req.params.id
    // console.log(acc_no)
    const sql = `select * from account where account_phone='${acc_no}'`
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})
// create
app.post('/pushacc', (req, res) => {
    const {account_phone, account_name, account_email, ticket_count} = req.body
    // console.log(req.body)
    const sql = `select * from account`
    const sql2 = `insert into account(account_phone, account_name, account_email, ticket_count) values('${account_phone}', '${account_name}', '${account_email}', '${ticket_count}')`
    let flag = 0
    conn.query(sql, (err, result) => {
        if (err) throw err
        result.forEach(item => {
            if (account_phone == item.account_phone) {
                flag = 1
            }
        })
        if (flag === 1) {
            // console.log(result)
            res.json({error: 'Number Exists', statuscode: 422})
        }
        else {
            flag = 0
            conn.query(sql2, (err2, result2) => {
                if (err2) throw err2
                if (ticket_count>0) {
                    const sql3 = `select * from account where account_phone='${account_phone}'`
                    conn.query(sql3, (err3, result3) => {
                        if (err3) throw err3
                        // console.log(result3)
                        res.json(result3)
                    })
                }
                else {
                    res.json({success: `Only A new Account Created for '${account_phone}'`, statuscode:200})
                }
            })
        }
    })
})
// bulk data import
app.post('/pushaccbulk', (req, res) => {
    const data = req.body.Body
    // console.log(data)
    let flag
    data.forEach((item) => {
        // console.log(item.account_id)
        const {account_phone, account_name, account_email, ticket_count} = item
        const sql = `insert into account(account_phone, account_name, account_email, ticket_count) values('${account_phone}', '${account_name}', '${account_email}', '${ticket_count}')`
        conn.query(sql, (err, result) => {
            if (err) {
                flag = 0
            }
            else {
                flag = 1
                // if (ticket_count>0) {
                //     const sql2 = `select * from account where account_phone='${account_phone}'`
                //     conn.query(sql2, (err2, result2) => {
                //         if (err2) throw err2
                //         console.log(result2)
                //         res.json(result2)
                //     })
                // }
                // else {
                //     res.json({success: `Only A new Account Created for '${account_phone}'`, statuscode:200})
                // }
            }
        })
    })
    if (flag===0) {
        res.json({error: 'Bulk Import Failure.', statuscode: 422})
    }
    else {
        res.json({success: 'Bulk Import Success.', statuscode:201})
    }
})
// update
app.get('/editac/:id', (req, res) => {
    const id = req.params.id
    const sql = `select * from account where account_id = '${id}'`
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})
app.put('/updateacc/:id', (req, res) => {
    const accid = req.params.id
    const {account_phone, account_name, account_email} = req.body
    const sql = `update account set account_phone='${account_phone}', account_name='${account_name}', account_email='${account_email}' where account_id='${accid}'`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.send('Data Updated.')
    })
})
// delete
app.delete('/delacc/:id', (req, res) => {
    const accid = req.params.id
    const sql = `delete from account where account_id='${accid}'`
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.send('Data Deleted.')
    })
})


// Contest api
app.get('/viewcntst', (req, res) => {
    const sql = `select * from contest`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json(result)
    })
})
app.get('/viewcntsttck', (req, res) => {
    conn.query('select * from contest inner join user on contest.createdby_id = user.user_id; select contest_id, count(contest_id) as count_cntst from ticket group by ticket.contest_id having count(contest_id)>0', (err, results) => {
        if (err) throw err.message
        res.json(results)
    })
})
app.get('/viewcntst/:id', (req, res) => {
    const cntstid = req.params.id
    const sql = `select * from contest inner join user on contest.createdby_id = user.user_id where contest.contest_id='${cntstid}'`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json(result)
    })
})
app.post('/pushcntst', (req, res) => {
    const {contest_name, createdby_id, contest_state, contest_date} = req.body
    const sql = `insert into contest(contest_name, createdby_id, contest_state, contest_date) values('${contest_name}', '${createdby_id}', '${contest_state}', '${contest_date}')`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json(result)
    })
})
app.delete('/delcntst/:id', (req, res) => {
    const cntstid = req.params.id
    const sql = `delete from account where account_id='${cntstid}'`
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.send('Data Deleted.')
    })
})


// Prize api
app.get('/viewprz', (req, res) => {
    const sql = `select * from prize inner join contest on prize.contest_id = contest.contest_id order by prize.prize_rank`
    // const sql = `select * from prize`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json(result)
    })
})
app.get('/viewprz/:id', (req, res) => {
    const cntst_id = req.params.id
    const sql = `select * from prize inner join contest on prize.contest_id = contest.contest_id where prize.contest_id='${cntst_id}' order by prize.prize_rank`
    // const sql = `select * from prize`
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})
app.get('/vwprz/:id', (req, res) => {
    const cntst_id = req.params.id
    const sql = `select sum(quantity) as qty_totl, sum(stock) as stc_totl from prize inner join contest on prize.contest_id = contest.contest_id where prize.contest_id='${cntst_id} order by prize.prize_rank'`
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})
app.get('/getprz/:id', (req, res) => {
    const prz_id = req.params.id
    const sql = `select * from prize where prize_id='${prz_id}'`
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json(result)
    })
})
// photo upload
app.post('/addprz', upload.single('prize_link'), (req, res) => {
    // console.log(req.body)
    // console.log(req.file)
    const {prize_name, contest_id, prize_rank, quantity, prize_details} = req.body
    const {filename} = req.file
    const sql = `insert into prize(prize_name, contest_id, prize_rank, quantity, stock, prize_details, prize_link) values('${prize_name}', '${contest_id}', '${prize_rank}', '${quantity}', '${quantity}', '${prize_details}', '${filename}')`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json({success: 'New Prize details added successfully.', statuscode: 200, data: result})
    })
})
app.put('/updtprz/:id', upload.single('prize_link'), (req, res) => {
    const prz_id = req.params.id
    // console.log(`Update All :: `, req.body)
    const {prize_name, contest_id, prize_rank, stock, prize_details} = req.body
    const {filename} = req.file
    const sql = `update prize set prize_name='${prize_name}', contest_id='${contest_id}', prize_rank='${prize_rank}', stock='${stock}', prize_details='${prize_details}', prize_link='${filename}' where prize_id='${prz_id}'`
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json({success: 'Existing Prize Details Updated successfully.', statuscode: 200, data: result})
    })
})
app.put('/updtprzsimpl/:id', (req, res) => {
    const prz_id = req.params.id
    // console.log(`Update data Only :: `, req.body)
    const {prize_name, contest_id, prize_rank, stock, prize_details} = req.body
    const sql = `update prize set prize_name='${prize_name}', contest_id='${contest_id}', prize_rank='${prize_rank}', stock='${stock}', prize_details='${prize_details}' where prize_id='${prz_id}'`
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json({success: 'Existing Prize Details Updated successfully.', statuscode: 200, data: result})
    })
})
app.put('/edtprz/:id', (req, res) => {
    const przid = req.params.id
    const {stock} = req.body
    const sql = `update prize set stock='${stock}' where prize_id='${przid}'`
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json({success: `Prize Stock Updated Successfully`, statuscode:200})
    })
})


// Ticket api
app.get('/viewtckt', (req, res) => {
    const sql = `select * from ticket inner join account on ticket.account_id = account.account_id inner join contest on ticket.contest_id = contest.contest_id`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json(result)
    })
})
app.get('/viewtckt/:id', (req, res) => {
    const cntckid = req.params.id
    const sql = `select * from ticket inner join account on ticket.account_id = account.account_id inner join contest on ticket.contest_id = contest.contest_id where ticket.contest_id='${cntckid}'`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json(result)
    })
})
app.post('/booktckt', (req, res) => {
    const {account_id, account_phone, contest_id, ticket_count} = req.body
    let flg = 0
    for (let i=0; i<ticket_count; i++) {
        const sql = `insert into ticket(account_id, contest_id) values('${account_id}', '${contest_id}')`
        conn.query(sql, (err, result) => {
            if (err) {
                flg = 1
                throw err
            }
            else {
                flg = 0
            }
        })
    }
    if (flg===0) {
        res.json({success: `'${ticket_count}' Tickets Created for '${account_phone}'`, statuscode:201})
    }
    else {
        res.json({error: `Error in Ticket Creation.`, statuscode:423})
    }
})
app.post('/booktcktbulk', (req, res) => {
    const {account_id, contest_id} = req.body
    // console.log(req.body)
    const sql =`insert into ticket(account_id, contest_id) values('${account_id}', '${contest_id}')`
    conn.query(sql, (err, result) => {
        if (err) throw err
        res.json({success: `Ticket created successfully.`, statuscode:201})
    })
})
app.delete('/deltckt/:id', (req, res) => {
    // console.log(req.params.id)
    const tck_no = req.params.id
    const sql = `delete from ticket where ticket_no='${tck_no}'`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json(result)
    })
})


// Winner api
app.get('/viewwnr', (req, res) => {
    const sql = `select * from winner inner join account on winner.account_id = account.account_id inner join contest on winner.contest_id = contest.contest_id inner join prize on winner.prize_id = prize.prize_id`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json(result)
    })
})
app.get('/viewwnr/:id', (req, res) => {
    const cnts_id = req.params.id
    const sql = `select * from winner inner join account on winner.account_id = account.account_id inner join contest on winner.contest_id = contest.contest_id inner join prize on winner.prize_id = prize.prize_id where winner.contest_id='${cnts_id}' order by winner_id desc`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json(result)
    })
})
app.post('/pushwnr', (req, res) => {
    const {account_id, contest_id, rank} = req.body
    // console.log(req.body)
    const sql1 = `select * from prize inner join contest on prize.contest_id=contest.contest_id where prize.contest_id='${contest_id}' and prize.prize_rank='${rank}'`
    conn.query(sql1, (err, result) => {
        if (result.length===0) {
            console.error(`Prize Rank:'${rank}' Does not exist. Error:: ${err}`)
        }
        else {
            // console.log(result[0].contest_id)
            // console.log(result[0].prize_id)
            const sql2 = `insert into winner(account_id, contest_id, prize_id, winning_position) values('${account_id}', '${contest_id}', '${result[0].prize_id}', '${rank}')`
            conn.query(sql2, (err2, result2) => {
                if (err2) throw err2
                res.json(result2)
            })
        }
    })

})


// _________________________________________________________________________________________________
// USER api
app.get('/viewusr', (req, res) => {
    const sql = `select * from user`
    conn.query(sql, (err, result) => {
        if (err) throw err.message
        res.json({success:`User data fetched.`, statuscode:201, data:result})
    })
})
