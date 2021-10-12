const Command = require("../Structures/Command.js");
const mongoose = require("mongoose");
const ranked = require("../Structures/profileSchema.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "setlb",
  description: "Shows you the curren LeaderBoard of the season!",
  permission: "SEND_MESSAGES",

  async run(message, args, client) {
    ranked
      .find({ ServerID: message.guild.id })
      .sort([["points", "descending"]])
      .exec((err, res) => {
        if (err) return console.log(err);

        let embed = new Discord.MessageEmbed();
        embed.setTitle("Surcord Power Ranking");
        if (res.length === 0) {
          embed.setColor("RED").addField("No data");
          console.log("No data");
        } else if (res.length < 20) {
          embed.setColor("YELLOW");
          for (var i = 0; i < res.length; i++) {
            let member =
              message.guild.members.cache.get(res[i].userID) || "User left";
            if (member == "User left") {
              embed
                .addField(
                  `Top ${i + 1}! ${member}`,
                  `rank: ${res[i].rank}`,
                  `points: ${res[i].points}`,
                  `with ${res[i].wins} Wins!`
                )
                .setThumbnail(
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Super_Smash_Bros._Ultimate_logo.svg/1280px-Super_Smash_Bros._Ultimate_logo.svg.png"
                );
            } else {
              embed
                .addField(
                  `Top ${i + 1}! ${member.user.username}`,
                  `rank: ${res[i].rank}`,
                  `points: ${res[i].points}`,
                  `with ${res[i].wins} Wins!`
                )
                .setThumbnail(
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Super_Smash_Bros._Ultimate_logo.svg/1280px-Super_Smash_Bros._Ultimate_logo.svg.png"
                );
            }
          }
        } else {
          embed.setColor("BLUE");
          for (i = 0; i < 20; i++) {
            let member =
              message.guild.members.cache.get(res[i].userID) || "User left";
            if (member == "User left") {
              embed
                .addField(
                  `Top ${i + 1}! ${member}`,
                  `rank: ${res[i].rank}`,
                  `points: ${res[i].points}`,
                  `with ${res[i].wins} Wins!`
                )
                .setThumbnail(
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Super_Smash_Bros._Ultimate_logo.svg/1280px-Super_Smash_Bros._Ultimate_logo.svg.png"
                );
            } else {
              embed
                .addField(
                  `Top ${i + 1}! ${member.user.username}`,
                  `rank: ${res[i].rank}`,
                  `points: ${res[i].points}`,
                  `with ${res[i].wins} Wins!`
                )
                .setThumbnail(
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Super_Smash_Bros._Ultimate_logo.svg/1280px-Super_Smash_Bros._Ultimate_logo.svg.png"
                );
            }
          }
        }
        message.channel.send({ embeds: [embed] });
      });
    module.exports.help = {
      name: "leaders",
      alias: "leaderBoards",
    };
  },
});
