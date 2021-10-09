const Command = require("../Structures/Command.js");
const profileModels = require("../Structures/profileSchema.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "profile",
  description:
    "Creates a new Ranking Profile, or advertise you if you already have one",
  permission: "SEND_MESSAGES",

  async run(message, args, client) {
    let profileData;
    const target = message.mentions.users.first();
    if (!target) {
      try {
        profileData = await profileModels.findOne({
          userID: message.author.id,
        });
        targetData = await profileModels.findOne({});
        if (!profileData) {
          await message.reply(
            `You do not have a Ranking profile in SurCord let me create one`
          );
          await profileModels
            .find({ ServerID: message.guild.id })
            .sort([["points", "descending"]])
            .exec((err, res) => {
              let profile = profileModels.create({
                nameTag: message.author.tag,
                userID: message.author.id,
                serverID: message.guild.id,
                points: 0,
                wins: 0,
                defeats: 0,
              });
            });
          message.reply("Done!, welcome to Surcord Ranking");

          const embed = new Discord.MessageEmbed();

          embed
            .setTitle(`${message.author.tag} Surcord Ranking Profile`)
            .setColor("RANDOM")
            .setThumbnail(message.author.avatarURL({ dynamic: true }))
            .addField(`Surcord ranking Points :`, `${profileData.points}`, true)
            .addFields(
              {
                name: `Wins :`,
                value: `${profileData.wins}`,
                inline: true,
              },
              {
                name: `Defeats :`,
                value: `${profileData.defeats}`,
                inline: true,
              },
              {
                name: `Surcord Win % :`,
                value: `${
                  (profileData.wins /
                    (profileData.wins + profileData.defeats)) *
                  100
                }%`,
                inline: true,
              }
            );

          await message.channel.send({ embeds: [embed] });
        } else {
          const embed = new Discord.MessageEmbed();

          embed
            .setTitle(`${message.author.tag} Surcord Ranking Profile`)
            .setColor("RANDOM")
            .setThumbnail(message.author.avatarURL({ dynamic: true }))
            .addField(`Surcord ranking Points :`, `${profileData.points}`, true)
            .addFields(
              {
                name: `Wins :`,
                value: `${profileData.wins}`,
                inline: true,
              },
              {
                name: `Defeats :`,
                value: `${profileData.defeats}`,
                inline: true,
              },
              {
                name: `Surcord Win % :`,
                value: `${
                  (profileData.wins /
                    (profileData.wins + profileData.defeats)) *
                  100
                }%`,
                inline: true,
              }
            );

          message.channel.send({ embeds: [embed] });
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        const targetData = await profileModels.findOne({ userID: target.id });
        if (!targetData) {
          await message.reply(
            `The target does not have a Ranking profile in SurCord let me create one`
          );
          await profileModels
            .find({ ServerID: message.guild.id })
            .sort([["points", "descending"]])
            .exec((err, res) => {
              let profile = profileModels.create({
                nameTag: target.tag,
                userID: target.id,
                serverID: message.guild.id,
                points: 0,
                wins: 0,
                defeats: 0,
              });
            });
          message.reply("Done!, welcome to Surcord Ranking");
          profile.save();
          const embed = new Discord.MessageEmbed();

          embed
            .setTitle(`${target.tag} Surcord Ranking Profile`)
            .setColor("RANDOM")
            .setThumbnail(target.avatarURL({ dynamic: true }))
            .addField(`Surcord ranking Points :`, `${targetData.points}`, true)
            .addFields(
              {
                name: `Wins :`,
                value: `${targetData.wins}`,
                inline: true,
              },
              {
                name: `Defeats :`,
                value: `${targetData.defeats}`,
                inline: true,
              },
              {
                name: `Surcord Win % :`,
                value: `${
                  (targetData.wins / (targetData.wins + targetData.defeats)) *
                  100
                }%`,
                inline: true,
              }
            );

          await message.channel.send({ embeds: [embed] });
        } else {
          const embed = new Discord.MessageEmbed();

          embed
            .setTitle(`${target.tag} Surcord Ranking Profile`)
            .setColor("RANDOM")
            .setThumbnail(target.avatarURL({ dynamic: true }))
            .addField(`Surcord ranking Points :`, `${targetData.points}`, true)
            .addFields(
              {
                name: `Wins :`,
                value: `${targetData.wins}`,
                inline: true,
              },
              {
                name: `Defeats :`,
                value: `${targetData.defeats}`,
                inline: true,
              },
              {
                name: `Surcord Win % :`,
                value: `${
                  (targetData.wins / (targetData.wins + targetData.defeats)) *
                  100
                }%`,
                inline: true,
              }
            );

          await message.channel.send({ embeds: [embed] });
        }
      } catch (err) {
        return console.log(err);
      }
    }
  },
});
