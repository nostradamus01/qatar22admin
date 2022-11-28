const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const serverless = require('serverless-http');

const uri = process.env.MongoURL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const app = express();
const router = express.Router();

app.use(express.static('public'));
app.use(bodyParser.json());

const connect = async (callback) => {
    try {
        await client.connect();
        console.log('Connected successfully');
        await callback();
        client.close();
    } catch (e) {
        console.error(e);
    }
}

router.get('/toLogin', async (req, res) => {
    res.redirect('https://fifa2022ap.netlify.app/pages/login.html');
});

router.post('/login', async (req, res) => {
    await connect(async () => {
        let success = false;
        const { username, password } = req.body;
        try {
            const user = await client.db('fifa22cup').collection('adminUsers').findOne({
                username: username
            });
            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    success = true;
                }
            }
        } catch (e) {
            console.error(e);
        }
        res.send({success: success});
    });
});

router.post('/setResult', async (req, res) => {
    await connect(async () => {
        let success = false;
        let { matchId, g1, g2 } = req.body;
        let obj = {};
        obj.finished = 'yes';
        if (g1 && g1 !== 0) {
            obj['g1'] = parseInt(g1);
        } else if (g2 && g2 !== 0) {
            obj['g2'] = parseInt(g2);
        }
        try {
            await client.db('fifa22cup').collection('results').updateOne(
                {matchId: matchId},
                {$set: obj}
            );
            success = true;
        } catch (e) {
            console.error(e);
        }
        res.send({success: success});
    });
});

router.post('/getAllData', async (req, res) => {
    await connect(async () => {
        try {
            // const users = await client.db('fifa22cup').collection('users').find().toArray();
            // users.forEach(user => {
            //     delete user.pinCode;
            // });
            // const teams = await client.db('fifa22cup').collection('teams').find().toArray();
            const matches = await client.db('fifa22cup').collection('matches').find().toArray();
            // const predictions = await client.db('fifa22cup').collection('predictions').find().toArray();
            const results = await client.db('fifa22cup').collection('results').find().toArray();
            res.send({
                // allUsers: users,
                // allTeams: teams,
                allMatches: matches,
                // allPredictions: predictions,
                allResults: results
            });
        } catch (e) {
            console.error(e);
        }
    });
});

app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);

// app.post('/createUser', async (req, res) => {
//     await connect(async () => {
//         let success = false;
//         const { username, password, name } = req.body;
//         try {
//             const bcryptedPassword = await bcrypt.hash(password, 3);
//             await client.db('fifa22cup').collection('adminUsers').insertOne({
//                 username: username,
//                 password: bcryptedPassword,
//                 name: name
//             });
//             success = true;
//         } catch (e) {
//             console.error(e);
//         }
//         res.send({success: success});
//     });
// });

// app.post('/changePIN', async (req, res) => {
//     await connect(async () => {
//         let success = false;
//         const { username, pinCode } = req.body;
//         try {
//             const bcryptedPinCode = await bcrypt.hash(pinCode, 3);
//             await client.db('fifa22cup').collection('users').updateOne(
//                 {username: username},
//                 {$set: {
//                     pinCode: bcryptedPinCode
//                 }}
//             );
//             success = true;
//         } catch (e) {
//             console.error(e);
//         }
//         res.send({success: success});
//     });
// });

// app.post('/getAllUsers', async (req, res) => {
//     await connect(async () => {
//         try {
//             const users = await client.db('fifa22cup').collection('users').find().toArray();
//             users.forEach(user => {
//                 delete user.pinCode;
//             });
//             res.send({users: users});
//         } catch (e) {
//             console.error(e);
//         }
//     });
// });

// app.post('/setPrediction', async (req, res) => {
//     await connect(async () => {
//         let success = false;
//         let { userId, matchId, g1, g2 } = req.body;
//         let obj = {};
//         if (g1 && g1 !== 0) {
//             obj['g1'] = parseInt(g1);
//         } else if (g2 && g2 !== 0) {
//             obj['g2'] = parseInt(g2);
//         }
//         try {
//             const match = await client.db('fifa22cup').collection('matches').findOne({
//                 matchId: matchId
//             });
//             if (match) {
//                 let matchTime = new Date(match.date);
//                 let timeNow = new Date();
//                 if (matchTime.getTime() > timeNow.getTime()) {
//                     await client.db('fifa22cup').collection('predictions').updateOne(
//                         {userId: userId, matchId: matchId},
//                         {$set: obj}
//                     );
//                     success = true;
//                 }
//                 await client.db('fifa22cup').collection('predictions').updateOne(
//                     {userId: userId, matchId: matchId},
//                     {$set: obj}
//                 );
//                 success = true;
//             }
//         } catch (e) {
//             console.error(e);
//         }
//         res.send({success: success});
//     });
// });

// app.post('/setPoints', async (req, res) => {
//     await connect(async () => {
//         let success = false;
//         let { userId, matchId, points } = req.body;
//         try {
//             await client.db('fifa22cup').collection('predictions').updateOne(
//                 {userId: userId, matchId: matchId},
//                 {$set: {
//                     points: points
//                 }}
//             );
//             success = true;
//         } catch (e) {
//             console.error(e);
//         }
//         res.send({success: success});
//     });
// });

// app.post('/setAllPoints', async (req, res) => {
//     await connect(async () => {
//         let success = false;
//         let { username, points } = req.body;
//         try {
//             await client.db('fifa22cup').collection('users').updateOne(
//                 {username: username},
//                 {$set: {
//                     points: points
//                 }}
//             );
//             success = true;
//         } catch (e) {
//             console.error(e);
//         }
//         res.send({success: success});
//     });
// });

// DON'T DELETE

// app.post('/createTeams', async (req, res) => {
//     let success = false;
//     let { teamId, code, name } = req.body;
//     try {
//         code = code.toLowerCase();
//         await client.db('fifa22cup').collection('teams').insertOne({
//             teamId: teamId,
//             code: code,
//             name: name
//         });
//         success = true;
//     } catch (e) {
//         console.error(e);
//     }
//     res.send({success: success});
// });

// app.post('/createMatches', async (req, res) => {
//     let success = false;
//     let { matchId, t1, t2, date } = req.body;
//     try {
//         await client.db('fifa22cup').collection('matches').insertOne({
//             matchId: matchId,
//             t1: t1.toLowerCase(),
//             t2: t2.toLowerCase(),
//             date: date
//         });
//         success = true;
//     } catch (e) {
//         console.error(e);
//     }
//     res.send({success: success});
// });

// app.post('/createPredictions', async (req, res) => {
//     let success = false;
//     let { matchId, userId, g1, g2, points } = req.body;
//     try {
//         await client.db('fifa22cup').collection('predictions').insertOne({
//             userId: userId,
//             matchId: matchId,
//             g1: g1,
//             g2: g2,
//             points: points
//         });
//         success = true;
//     } catch (e) {
//         console.error(e);
//     }
//     res.send({success: success});
// });

// app.post('/createResults', async (req, res) => {
//     let success = false;
//     let { matchId, g1, g2 } = req.body;
//     try {
//         await client.db('fifa22cup').collection('results').insertOne({
//             matchId: matchId,
//             g1: g1,
//             g2: g2
//         });
//         success = true;
//     } catch (e) {
//         console.error(e);
//     }
//     res.send({success: success});
// });