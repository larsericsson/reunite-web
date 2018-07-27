const https = require('https');
const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
function get(url) {
    return new Promise((resolve, reject) => {
        let data = '';
        https.get(url, (resp) => {
            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                resolve(JSON.parse(data));
            })

            resp.on('error', (err) => {
                reject(err);
            });
        });
    });
}

function cors(response, origin) {
    return response.set('Access-Control-Allow-Origin', origin)
        .set('Access-Control-Allow-Methods', 'GET, POST')
        .set('Access-Control-Allow-Headers', 'Content-Type');;
}

// Do shit here :)
function getPlayer(player) {
    return new Promise(((resolve, reject) => {
        get('https://stats.quake.com/api/v2/Player/Stats?name=' + player)
            .then((data) => {
                let stats = {

                };
                stats.playerRatings = data.playerRatings;
                stats.icons = {
                    nameplate: 'https://stats.quake.com/nameplates/' + data.playerLoadOut.namePlateId + '.png',
                    icon: 'https://stats.quake.com/icons/' + data.playerLoadOut.iconId + '.png'

                };
                resolve(stats);
            });
    }));

}

exports.playerStats = functions.https.onRequest((request, response) => {
    if (request.method === 'OPTIONS') {
        cors(response, '*').send({});
    } else {
        let promises = [];
        let body = {};

        request.body.data.forEach(
            player => {
                promises.push(getPlayer(player).then((stats) => {
                    body[player] = stats;
                }));
            }
        );

        Promise.all(promises).then(() => {
            cors(response, '*').send(JSON.stringify({data: body}));
        });
    }
});
