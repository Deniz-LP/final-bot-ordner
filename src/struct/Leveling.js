const client = require("..");

module.exports = class LevelingSystem {
    constructor(client) {
        this.client = client;
        this.xp = 1
        this.timeBotStared = BigInt(Date.now());
    }


    async addXp(message) {
        return 1;
        let con = this.client.db.con;
        con.query(`SELECT * FROM Leveling WHERE player_id = '` + message.author.id + `' AND server_id LIKE '` + message.guild.id + `';`, (err, rows) => {
            if (err) throw err;


            if (rows.length >= 1) {
        let XP = rows[0].xplevel;
        let Gained = Math.floor(Math.random() * 20);
        let Gained10bis30 = Gained + 10;
        let XPneu = (parseInt(XP)) + Gained10bis30;



        let b = parseInt(LevelNR);
        b1 = b;

        var levelingAmount = 200;
        sql = `UPDATE Leveling SET xplevel = ` + (XPneu - (levelingAmount + (levelingAmount * b))) + ` WHERE player_id = '` + message.author.id + `' AND server_id LIKE '` + message.guild.id + `';`;
                            con.query(sql);
                            
            }
        });
        return 2;
    }

    

}