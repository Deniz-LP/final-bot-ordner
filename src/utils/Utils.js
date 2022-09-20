const path = require('path')
const {promisify} = require('util')
const glob = require('glob')
const Event = require('../struct/Events')
const config = require('../config')
const Command = require('../struct/Commands')
const { Message } = require('discord.js')
const globPromise = promisify(glob)
module.exports = class Utils {
    constructor(client) {
        this.client = client;
        this.sleep = false;
    }


    get directory() {
        return `${path.dirname(require.main.filename)}${path.sep}`;
    }

    chunk(array, size) {
		const chunked_arr = [];
		for (let i = 0; i < array.length; i+=size) {
			chunked_arr.push(array.slice(i, i + size));
		}
		return chunked_arr;
	}
    parseMs(milliseconds) {
    
        const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;
    
        return {
            days: roundTowardsZero(milliseconds / 86400000),
            hours: roundTowardsZero(milliseconds / 3600000) % 24,
            minutes: roundTowardsZero(milliseconds / 60000) % 60,
            seconds: roundTowardsZero(milliseconds / 1000) % 60,
            milliseconds: roundTowardsZero(milliseconds) % 1000,
            microseconds: roundTowardsZero(milliseconds * 1000) % 1000,
            nanoseconds: roundTowardsZero(milliseconds * 1e6) % 1000
        };
    }


    async loadCommands() {
       const commands = await globPromise(`${this.directory}Commands/**/*.js`.replace(/\\/g, '/'))
       for (const commandFile of commands) {
           delete require.cache[commandFile]
           const {name} = path.parse(commandFile)
           const command = require(commandFile)
           if (!command instanceof Command) throw new TypeError(`Command ${name} is not a valid command`)
           this.client.commands.set(command.name, command)
           if (command.aliases.length) {
               for (const alias of command.aliases) {
                   this.client.aliases.set(alias, command.name)
               }
           }
       }
    }

    async loadEvents() {
        const events = await globPromise(`${this.directory}events/**/*.js`.replace(/\\/g, '/'))
        for (const eventFile of events) {
            delete require.cache[eventFile]
            const {name} = path.parse(eventFile)
            const File = require(eventFile)
            const event = new File(this.client, name.toLocaleLowerCase())
            if (!(event instanceof Event)) throw new TypeError(`This is a bad class`)
            this.client.events.set(event.name, event);
            event.emmiter[event.type](name, (...args)=> event.run(this.client, ...args))
        }
    }

   sleeping(Welcherstatus){
     if(Welcherstatus == true){
      this.sleep = true;
     }else{
      this.sleep = false;
     }
   }
   isSleeping(){
    return this.sleep;
  }

 


    translation(lang, textErstDeutsch) {
     
        if (lang == 'de') return textErstDeutsch[0];
        return textErstDeutsch[1]
    }
    


     isInt(value) {
        return !isNaN(value) && (function (x) { return (x | 0) === x; })(parseFloat(value))
      }
      /**
        * @param {Message} message
        */
       
      TestRechte(message) {
        
        let con = this.client.db.con;
        let sql;
        if (/*message.member.hasPermission("ADMINISTRATOR") || */this.client.config.OWNERS.includes(message.author.id) || message.guild.ownerID === message.author.id) {
          return true;
  
        } else {
          con.query(`SELECT * FROM Moderation WHERE server = '` + message.guild.id + `';`, (err, rows3) => {
            if (err) throw err;
            if (rows3.length >= 1) {
              let a2 = 1;
              for (let a = 0; a < rows3.length; a++) {
  
                let myRole = message.guild.roles.cache.get(rows3[a].role);
  
                if (myRole != undefined) {
                  //console.log(myRole.id);
                  for (let num = 0; num <= 100; num++) {
  
                    if (message.author.roles.cache.has(myRole.id)) {
  
                      if (a2 === 1) {
                        a2 = 2;
  
                        return true;
                      }
                    }
                  }
                } else if (typeof rows3[a].role === 'string' && rows3[a].role != undefined) {
                  sql = `DELETE FROM Moderation WHERE server = '` + message.guild.id + `' AND role = '` + rows3[a].role + `'`;
  
                  con.query(sql);
                  //console.log(rows3[a].role)
                }
  
  
              }
              //console.log(a2);
  
              if (a2 === 1) {
                return false;
              }
  
            } else {
              return false;
            }
  
  
  
  
          });
  
        }
      }
  
      
      DeleteMessage(message, anzahl) {
  
        if ((message.channel.permissionsFor(this.client.user).has("MANAGE_MESSAGES"))) {
  
          let a = parseInt(anzahl);
  
          message.channel.bulkDelete(a);
  
        } else {
  
          SpracheUndSendMessagePerms("0", "Entschuldigen für Störung, aber Jamal bräuchte die Berechtigung MANAGE_MESSAGES, <@" + message.guild.ownerID + ">.",
            "Sorry for disturb, but Jamal would like to get the permission MANAGE_MESSAGES, <@" + message.guild.ownerID + ">.");
  
        }
      }
}