////////////////////////////////////////////////////////////////
const { Client, RichEmbed } = require('discord.js');
const fs = require('fs')
const client = new Client();
client.on('ready', () => {
    console.log('I am ready!');
});

let prefix = "!"


const warns = JSON.parse(fs.readFileSync('./warns.json'))
//Page d'aide

client.on('message', message => {
    if (message.content === '!help') {
    const embedd = new RichEmbed()
    .setTitle('Page de aide')
    .setColor(0x8000FF)
    .setDescription('Les commandes utilisables :')
    .addField("!invitelebot","donne une invitation pour que tu ajoutes le bot sur ton serveur Discord.")
    .addField("!helpS","Donne les commandes pouvant être exéctuée(s)", true)
    .addField("Conditions","Les Développeurs du Bot ne sont en aucun cas résponsables des dégats et autres pouvant être provoqué par le Bot.", true)
    message.channel.send(embedd);
    }
});



//CommandesAdmin
client.on('message', message => {
  if (message.content === '!helpS') {
  const embedd = new RichEmbed()
  .setTitle('Commandes Administrateur & Staff')
  .setColor(0x8000FF)
  .setDescription('Commandes de Sanctions')
  .addField("!clear + nombre","Supprime le nombre de message(s) demandé dans le salon où est exécuté la commande.", true)
  .addField("!mute @pseudo","Rend muet l'utilisateur mentionné l'empêchant-donc d'envoyer des messages.", true)
  .addField("!kick @pseudo","Ejecte (mais n'empêche pas de revenir) l'utilisateur mentionné", true)
  .addField("!ban @pseudo","Bannis le joueur mentionné l'empêchant donc de revenir", true)
  .addField("Conditions","Les Développeurs du Bot ne sont en aucun cas résponsables des dégats et autres pouvant être provoqué par le Bot.", true)
  message.channel.send(embedd);
  }
});



//Invitation
client.on('message', message => {
  if (message.content === '!invitelebot') {
  const embed01 = new RichEmbed()
  .setTitle('Lien invitation du Bot')
  .setColor(0x8000FF)
  .setDescription('[Invite-le](https://discordapp.com/oauth2/authorize?client_id=650994322212388894&scope=bot&permissions=8)');
  message.channel.send(embed01);
  }
});


/////////////////////////////////////////////////////////////////////
//activation du client
client.on("ready", () => {


    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  
  //status /activity
    client.user.setActivity(`!help`);
  
  });

  
//Kick
client.on('message', function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g)

  if (args[0].toLowerCase() === prefix + 'kick') {
     if (!message.member.hasPermission('KICK_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ! :x:(")
     let member = message.mentions.members.first()
     if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
     if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas kick cet utilisateur ! :x:")
     if (!member.kickable) return message.channel.send("Je ne peux pas exclure cet utilisateur !:x:")
     member.kick()
     message.channel.send('**' + member.user.username + '** a été exclu !😎')
  }
})

//Ban
client.on('message', function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g)

  if (args[0].toLocaleLowerCase() === prefix + 'ban') {
     if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande !:x:(")
     let member = message.mentions.members.first()
     if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
     if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.owner.id) return message.channel.send("Vous ne pouvez pas bannir cet utilisateur ! :x:")
     if (!member.bannable) return message.channel.send("Je ne peux pas bannir cet utilisateur !:x:")
     message.guild.ban(member, {days: 7})
     message.channel.send('**' + member.user.username + '** a été banni !😎')
  }
})

//Clear
client.on('message', function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g)

  if (args[0].toLowerCase() === prefix + "clear") {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ! :x:")
      let count = parseInt(args[1])
      if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer :x:")
      if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide :x:")
      if (count < 1 || count > 100) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100 :x:")
      message.channel.bulkDelete(count + 1, true)
      message.channel.send(count + ' message(s) ont été suprimé(s) :white_check_mark:') ;
    }

//Mute
  if (args[0].toLowerCase() === prefix + "mute") {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ! :x:")
      let member = message.mentions.members.first()
      if (!member) return message.channel.send("Veuillez mentionner un utilisateur :x:")
      if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas mute ce membre ! :x:")
      if (!member.manageable) return message.channel.send("Je ne peux pas mute ce membre ! :x:")
      let muterole = message.guild.roles.find(role => role.name === 'Muted')
      if (muterole) {
          member.addRole(muterole)
          message.channel.send(member + ' a été mute 😎')
      }
      else {
          message.guild.createRole({name: 'Muted', permissions: 0}).then(function (role) {
              message.guild.channels.filter(channel => channel.type === 'text').forEach(function (channel) {
                  channel.overwritePermissions(role, {
                      SEND_MESSAGES: false
                  })
              })
              member.addRole(role)
              message.channel.send(member + ' a été mute 😎')
          })
      }
  }
})

//Warns
client.on("message", function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g)

  if (args[0].toLowerCase() === prefix + "warn") {
      if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ! :x:")
      let member = message.mentions.members.first()
      if (!member) return message.channel.send("Veuillez mentionner un membre :x:")
      if (member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas warn ce membre ! :x:")
      let reason = args.slice(2).join(' ')
      if (!reason) return message.channel.send("Veuillez indiquer une raison :x:")
      if (!warns[member.id]) {
          warns[member.id] = []
      }
      warns[member.id].unshift({
          reason: reason,
          date: Date.now(),
          mod: message.author.id
      })
      fs.writeFileSync('./warns.json', JSON.stringify(warns))
      message.channel.send(member + " a été warn pour " + reason + " 😎")
  }
})


client.on("message", function (message) {
  if (!message.guild) return
  let args = message.content.trim().split(/ +/g)

  //unmute
  if (args[0].toLowerCase() === prefix + "unmute") {
      if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ! :x:")
      let member = message.mentions.members.first()
      if(!member) return message.channel.send("Membre introuvable :x:")
      if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unmute ce membre ! :x:")
      if(!member.manageable) return message.channel.send("Je ne pas unmute ce membre ! :x:")
      let muterole = message.guild.roles.find(role => role.name === 'Muted')
      if(muterole && member.roles.has(muterole.id)) member.removeRole(muterole)
      message.channel.send(member + ' a été unmute :white_check_mark:')
  }

  //unwarn
  if (args[0].toLowerCase() === prefix + "unwarn") {
      let member = message.mentions.members.first()
      if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande ! :x:")
      if(!member) return message.channel.send("Membre introuvable :x:")
      if(member.highestRole.calculatedPosition >= message.member.highestRole.calculatedPosition && message.author.id !== message.guild.ownerID) return message.channel.send("Vous ne pouvez pas unwarn ce membre ! :x:")
      if(!member.manageable) return message.channel.send("Je ne peux pas unwarn ce membre ! :x:")
      if(!warns[member.id] || !warns[member.id].length) return message.channel.send("Ce membre n'a actuellement aucun warns. 😇")
      warns[member.id].shift()
      fs.writeFileSync('./warns.json', JSON.stringify(warns))
      message.channel.send("Le dernier warn de " + member + " a été retiré :white_check_mark:")
  }
})

//LOGIN
client.login('NjUwOTk0MzIyMjEyMzg4ODk0.Xgpazw.KfLsqG7eaCLupraKwG8hwMdhhUc')
