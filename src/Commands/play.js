const Command = require("../Structures/Command.js");
const profileModels = require("../Structures/profileSchema.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "ibeat",
  description: "choose a user to play for points",
  parameters: "<user_Target>",
  permission: "SEND_MESSAGES",

  async run(message, args, cmd, client, discord, profileData) {
    const target = message.mentions.users.first();
    profileData = await profileModels.findOne({ userID: message.author.id });

    if (!args.length)
      return message.channel.send("You need to mention a player to play with");

    if (!target) return message.channel.send("That user does not exist");

    if (target == message.author.id)
      return message.channel.send("No patrick you can not fight yourself");

    const targetData = await profileModels.findOne({ userID: target.id });

    const messageAuthorOC = message.author;
    const SelfTargetData = await profileModels.findOne({
      userID: message.author.id,
    });

    if (!SelfTargetData) {
      message.channel.send(
        "You do not have a Ranking profile \n Let me correct that"
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
            rank: "Beginner",
          });
        });
    }

    if (!targetData) {
      message.channel.send(
        "Target user does not have a Ranking profile\n Let me create it "
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
            rank: "Beginner",
          });
        });
    }

    /*console.log(targetData.userID + " targetData Loser id"); //perdedor
    console.log(targetData.nameTag + " target Loser tag"); //perdedor
    console.log(targetData.points + " target Loser points"); //perdedor
    console.log(targetData.wins + " target winner points"); //perdedor
    console.log(targetData.defeats + " target Loser points"); //perdedor
    const winner = profileModels.findOne({ userID: messageAuthorOC.id });
    console.log(SelfTargetData.userID + " messageAuthor Winner id"); //ganador
    console.log(messageAuthorOC.id + " messageAuthor Winner tag"); //ganador
    console.log(SelfTargetData.points + " messageAuthor Winner points"); //ganador
    console.log(SelfTargetData.wins + " messageAuthor Winner times"); //ganador
    console.log(SelfTargetData.defeats + " messageAuthor defeats times"); //ganador
    */

    let lPoint = 45;
    let wPoint = 95;

    /*
    Beginner: - 0 pts
    Bronze: - 500pts
    Silver: - 1200pts
    Gold: - 200pts
    Platinum: - 3000pts
    Diamond:- 4000pts
    Surcord Hidden Boss: - 5000pts
    Surcord Top Player: - 6000pts.
    */
    let lR = 0;
    let wR = 0;

    switch (targetData.rank) {
      case "Beginner":
        lR = 0;
        break;
      case "Bronze":
        lR = 1;
        break;
      case "Silver":
        lR = 2;
        break;
      case "Gold":
        lR = 3;
        break;
      case "Platinum":
        lR = 4;
        break;
      case "Diamond":
        lR = 5;
        break;
      case "Hidden Boss":
        lR = 6;
        break;
      case "Top Player":
        lR = 7;
        break;
    }

    switch (SelfTargetData.rank) {
      case "Beginner":
        wR = 0;
        break;
      case "Bronze":
        wR = 1;
        break;
      case "Silver":
        wR = 2;
        break;
      case "Gold":
        wR = 3;
        break;
      case "Platinum":
        wR = 4;
        break;
      case "Diamond":
        wR = 5;
        break;
      case "Hidden Boss":
        wR = 6;
        break;
      case "Top Player":
        wR = 7;
        break;
    }

    if (lR - 7 == wR) {
      lPoint = 300;
      wPoint = 335;
    } else if (lR - 6 == wR) {
      lPoint = 240;
      wPoint = 275;
    } else if (lR - 5 == wR) {
      lPoint = 155;
      wPoint = 235;
    } else if (lR - 4 == wR) {
      lPoint = 115;
      wPoint = 185;
    } else if (lR - 3 == wR) {
      lPoint = 100;
      wPoint = 135;
    } else if (lR - 2 == wR) {
      lPoint = 85;
      wPoint = 115;
    } else if (lR - 1 == wR) {
      lPoint = 65;
      wPoint = 105;
    } else if (lR == wR) {
      lPoint = 45;
      wPoint = 95;
    } else if (lR + 1 == wR) {
      lPoint = 40;
      wPoint = 75;
    } else if (lR + 2 == wR) {
      lPoint = 35;
      wPoint = 65;
    } else if (lR + 3 == wR) {
      lPoint = 25;
      wPoint = 45;
    } else if (lR + 4 == wR) {
      lPoint = 20;
      wPoint = 20;
    } else if (lR + 5 == wR) {
      lPoint = 10;
      wPoint = 15;
    } else if (lR + 6 == wR) {
      lPoint = 5;
      wPoint = 10;
    } else if (lR + 7 == wR) {
      lPoint = 0;
      wPoint = 5;
    }

    await message.channel.send(
      `Hey ${target}, <@${message.author.id}> Reported your match result \n the winner gained ${wPoint} points and the defeated lost ${lPoint} points!`
    );

    if (targetData.points < lPoint) {
      await profileModels.updateOne(
        { userID: targetData.userID },
        { points: 0, $inc: { defeats: 1 }, rank: "Beginner" }
      );

      const embed = new Discord.MessageEmbed();

      embed
        .setTitle(`${target.tag} Surcord Ranking Profile`)
        .setColor("RED")
        .setThumbnail(target.avatarURL({ dynamic: true }))
        .addField(`Surcord ranking Points :`, `${targetData.points} -> 0`, true)
        .addField(`Surcord Ranking:`, `${targetData.rank} -> Beginner`, true)
        .addFields(
          {
            name: `Wins :`,
            value: `${profileData.wins}`,
            inline: true,
          },
          {
            name: `Defeats :`,
            value: `${profileData.defeats} -> ${profileData.defeats + 1} `,
            inline: true,
          },
          {
            name: `Surcord Win % :`,
            value: `${
              (profileData.wins / (profileData.wins + profileData.defeats)) *
              100
            }%`,
            inline: true,
          }
        );

      await message.channel.send({ embeds: [embed] });
    } else {
      if (targetData.points - lPoint < 501) {
        await profileModels.updateOne(
          { userID: targetData.userID },
          {
            $inc: {
              points: -lPoint,
              defeats: +1,
            },
            rank: "Beginner",
          }
        );

        const embed = new Discord.MessageEmbed();

        embed
          .setTitle(`${target.tag} Surcord Ranking Profile`)
          .setColor("RED")
          .setThumbnail(target.avatarURL({ dynamic: true }))
          .addField(
            `Surcord ranking Points :`,
            `${targetData.points} -> ${targetData.points - lPoint}`,
            true
          )
          .addField(`Surcord Ranking:`, `${targetData.rank} -> Beginner`, true)
          .addFields(
            {
              name: `Wins :`,
              value: `${profileData.wins}`,
              inline: true,
            },
            {
              name: `Defeats :`,
              value: `${profileData.defeats} -> ${profileData.defeats + 1} `,
              inline: true,
            },
            {
              name: `Surcord Win % :`,
              value: `${
                (profileData.wins / (profileData.wins + profileData.defeats)) *
                100
              }%`,
              inline: true,
            }
          );

        await message.channel.send({ embeds: [embed] });
      } else if (
        targetData.points - lPoint > 500 &&
        targetData.points - lPoint < 1201
      ) {
        await profileModels.updateOne(
          { userID: targetData.userID },
          {
            $inc: {
              points: -lPoint,
              defeats: +1,
            },
            rank: "Bronze",
          }
        );

        const embed = new Discord.MessageEmbed();

        embed
          .setTitle(`${target.tag} Surcord Ranking Profile`)
          .setColor("RED")
          .setThumbnail(target.avatarURL({ dynamic: true }))
          .addField(
            `Surcord ranking Points :`,
            `${targetData.points} -> ${targetData.points - lPoint}`,
            true
          )
          .addField(`Surcord Ranking:`, `${targetData.rank} -> Bronze `, true)
          .addFields(
            {
              name: `Wins :`,
              value: `${profileData.wins}`,
              inline: true,
            },
            {
              name: `Defeats :`,
              value: `${profileData.defeats} -> ${profileData.defeats + 1} `,
              inline: true,
            },
            {
              name: `Surcord Win % :`,
              value: `${
                (profileData.wins / (profileData.wins + profileData.defeats)) *
                100
              }%`,
              inline: true,
            }
          );

        await message.channel.send({ embeds: [embed] });
      } else if (
        targetData.points - lPoint > 1200 &&
        targetData.points - lPoint < 2001
      ) {
        await profileModels.updateOne(
          { userID: targetData.userID },
          {
            $inc: {
              points: -lPoint,
              defeats: +1,
            },
            rank: "Silver",
          }
        );

        const embed = new Discord.MessageEmbed();

        embed
          .setTitle(`${target.tag} Surcord Ranking Profile`)
          .setColor("RED")
          .setThumbnail(target.avatarURL({ dynamic: true }))
          .addField(
            `Surcord ranking Points :`,
            `${targetData.points} -> ${targetData.points - lPoint}`,
            true
          )
          .addField(`Surcord Ranking:`, `${targetData.rank} -> Silver `, true)
          .addFields(
            {
              name: `Wins :`,
              value: `${profileData.wins}`,
              inline: true,
            },
            {
              name: `Defeats :`,
              value: `${profileData.defeats} -> ${profileData.defeats + 1} `,
              inline: true,
            },
            {
              name: `Surcord Win % :`,
              value: `${
                (profileData.wins / (profileData.wins + profileData.defeats)) *
                100
              }%`,
              inline: true,
            }
          );

        await message.channel.send({ embeds: [embed] });
      } else if (
        targetData.points - lPoint > 2000 &&
        targetData.points - lPoint < 3001
      ) {
        await profileModels.updateOne(
          { userID: targetData.userID },
          {
            $inc: {
              points: -lPoint,
              defeats: +1,
            },
            rank: "Gold",
          }
        );

        const embed = new Discord.MessageEmbed();

        embed
          .setTitle(`${target.tag} Surcord Ranking Profile`)
          .setColor("RED")
          .setThumbnail(target.avatarURL({ dynamic: true }))
          .addField(
            `Surcord ranking Points :`,
            `${targetData.points} -> ${targetData.points - lPoint}`,
            true
          )
          .addField(`Surcord Ranking:`, `${targetData.rank} -> Gold `, true)
          .addFields(
            {
              name: `Wins :`,
              value: `${profileData.wins}`,
              inline: true,
            },
            {
              name: `Defeats :`,
              value: `${profileData.defeats} -> ${profileData.defeats + 1} `,
              inline: true,
            },
            {
              name: `Surcord Win % :`,
              value: `${
                (profileData.wins / (profileData.wins + profileData.defeats)) *
                100
              }%`,
              inline: true,
            }
          );

        await message.channel.send({ embeds: [embed] });
      } else if (
        targetData.points - lPoint > 3000 &&
        targetData.points - lPoint < 4001
      ) {
        await profileModels.updateOne(
          { userID: targetData.userID },
          {
            $inc: {
              points: -lPoint,
              defeats: +1,
            },
            rank: "Platinum",
          }
        );

        const embed = new Discord.MessageEmbed();

        embed
          .setTitle(`${target.tag} Surcord Ranking Profile`)
          .setColor("RED")
          .setThumbnail(target.avatarURL({ dynamic: true }))
          .addField(
            `Surcord ranking Points :`,
            `${targetData.points} -> ${targetData.points - lPoint}`,
            true
          )
          .addField(`Surcord Ranking:`, `${targetData.rank} -> Platinum `, true)
          .addFields(
            {
              name: `Wins :`,
              value: `${profileData.wins}`,
              inline: true,
            },
            {
              name: `Defeats :`,
              value: `${profileData.defeats} -> ${profileData.defeats + 1} `,
              inline: true,
            },
            {
              name: `Surcord Win % :`,
              value: `${
                (profileData.wins / (profileData.wins + profileData.defeats)) *
                100
              }%`,
              inline: true,
            }
          );

        await message.channel.send({ embeds: [embed] });
      } else if (
        targetData.points - lPoint > 4000 &&
        targetData.points - lPoint < 5001
      ) {
        await profileModels.updateOne(
          { userID: targetData.userID },
          {
            $inc: {
              points: -lPoint,
              defeats: +1,
            },
            rank: "Diamond",
          }
        );

        const embed = new Discord.MessageEmbed();

        embed
          .setTitle(`${target.tag} Surcord Ranking Profile`)
          .setColor("RED")
          .setThumbnail(target.avatarURL({ dynamic: true }))
          .addField(
            `Surcord ranking Points :`,
            `${targetData.points} -> ${targetData.points - lPoint}`,
            true
          )
          .addField(`Surcord Ranking:`, `${targetData.rank} -> Diamond `, true)
          .addFields(
            {
              name: `Wins :`,
              value: `${profileData.wins}`,
              inline: true,
            },
            {
              name: `Defeats :`,
              value: `${profileData.defeats} -> ${profileData.defeats + 1} `,
              inline: true,
            },
            {
              name: `Surcord Win % :`,
              value: `${
                (profileData.wins / (profileData.wins + profileData.defeats)) *
                100
              }%`,
              inline: true,
            }
          );

        await message.channel.send({ embeds: [embed] });
      } else if (
        targetData.points - lPoint > 5000 &&
        targetData.points - lPoint < 6001
      ) {
        await profileModels.updateOne(
          { userID: targetData.userID },
          {
            $inc: {
              points: -lPoint,
              defeats: +1,
            },
            rank: "Hidden Boss",
          }
        );

        const embed = new Discord.MessageEmbed();

        embed
          .setTitle(`${target.tag} Surcord Ranking Profile`)
          .setColor("RED")
          .setThumbnail(target.avatarURL({ dynamic: true }))
          .addField(
            `Surcord ranking Points :`,
            `${targetData.points} -> ${targetData.points - lPoint}`,
            true
          )
          .addField(
            `Surcord Ranking:`,
            `${targetData.rank} -> Hidden Boss `,
            true
          )
          .addFields(
            {
              name: `Wins :`,
              value: `${profileData.wins}`,
              inline: true,
            },
            {
              name: `Defeats :`,
              value: `${profileData.defeats} -> ${profileData.defeats + 1} `,
              inline: true,
            },
            {
              name: `Surcord Win % :`,
              value: `${
                (profileData.wins / (profileData.wins + profileData.defeats)) *
                100
              }%`,
              inline: true,
            }
          );

        await message.channel.send({ embeds: [embed] });
      } else if (targetData.points - lPoint > 6000) {
        await profileModels.updateOne(
          { userID: targetData.userID },
          {
            $inc: {
              points: -lPoint,
              defeats: +1,
            },
            rank: "Top Player",
          }
        );

        const embed = new Discord.MessageEmbed();

        embed
          .setTitle(`${target.tag} Surcord Ranking Profile`)
          .setColor("RED")
          .setThumbnail(target.avatarURL({ dynamic: true }))
          .addField(
            `Surcord ranking Points :`,
            `${targetData.points} -> ${targetData.points - lPoint}`,
            true
          )
          .addField(
            `Surcord Ranking:`,
            `${targetData.rank} -> Top Player `,
            true
          )
          .addFields(
            {
              name: `Wins :`,
              value: `${profileData.wins}`,
              inline: true,
            },
            {
              name: `Defeats :`,
              value: `${profileData.defeats} -> ${profileData.defeats + 1} `,
              inline: true,
            },
            {
              name: `Surcord Win % :`,
              value: `${
                (profileData.wins / (profileData.wins + profileData.defeats)) *
                100
              }%`,
              inline: true,
            }
          );

        await message.channel.send({ embeds: [embed] });
      }
    }

    if (SelfTargetData.points + wPoint < 500) {
      await profileModels.updateOne(
        { userID: message.author.id },
        { $inc: { points: +wPoint, wins: +1 }, rank: "Beginner" }
      );

      const Eembed = new Discord.MessageEmbed();

      Eembed.setTitle(`${message.author.tag} Surcord Ranking Profile`)
        .setColor("YELLOW")
        .setThumbnail(message.author.avatarURL({ dynamic: true }))
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.points} -> ${SelfTargetData.points + wPoint}`,
          true
        )
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.rank} -> Beginner`,
          true
        )
        .addFields(
          {
            name: `Wins :`,
            value: `${SelfTargetData.wins} -> ${SelfTargetData.wins + 1} `,
            inline: true,
          },
          {
            name: `Defeats :`,
            value: `${SelfTargetData.defeats} `,
            inline: true,
          },
          {
            name: `Surcord Win % :`,
            value: `${
              (SelfTargetData.wins /
                (SelfTargetData.wins + SelfTargetData.defeats)) *
              100
            }%`,
            inline: true,
          }
        );

      await message.channel.send({ embeds: [Eembed] });
    } else if (
      SelfTargetData.points + wPoint > 500 &&
      SelfTargetData.points + wPoint < 1200
    ) {
      await profileModels.updateOne(
        { userID: message.author.id },
        { $inc: { points: +wPoint, wins: +1 }, rank: "Bronze" }
      );

      const Eembed = new Discord.MessageEmbed();

      Eembed.setTitle(`${message.author.tag} Surcord Ranking Profile`)
        .setColor("YELLOW")
        .setThumbnail(message.author.avatarURL({ dynamic: true }))
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.points} -> ${SelfTargetData.points + wPoint}`,
          true
        )
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.rank} -> Bronze`,
          true
        )
        .addFields(
          {
            name: `Wins :`,
            value: `${SelfTargetData.wins} -> ${SelfTargetData.wins + 1} `,
            inline: true,
          },
          {
            name: `Defeats :`,
            value: `${SelfTargetData.defeats} `,
            inline: true,
          },
          {
            name: `Surcord Win % :`,
            value: `${
              (SelfTargetData.wins /
                (SelfTargetData.wins + SelfTargetData.defeats)) *
              100
            }%`,
            inline: true,
          }
        );

      await message.channel.send({ embeds: [Eembed] });
    } else if (
      SelfTargetData.points + wPoint > 1200 &&
      SelfTargetData.points + wPoint < 2000
    ) {
      await profileModels.updateOne(
        { userID: message.author.id },
        { $inc: { points: +wPoint, wins: +1 }, rank: "Silver" }
      );

      const Eembed = new Discord.MessageEmbed();

      Eembed.setTitle(`${message.author.tag} Surcord Ranking Profile`)
        .setColor("YELLOW")
        .setThumbnail(message.author.avatarURL({ dynamic: true }))
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.points} -> ${SelfTargetData.points + wPoint}`,
          true
        )
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.rank} -> Silver`,
          true
        )
        .addFields(
          {
            name: `Wins :`,
            value: `${SelfTargetData.wins} -> ${SelfTargetData.wins + 1} `,
            inline: true,
          },
          {
            name: `Defeats :`,
            value: `${SelfTargetData.defeats} `,
            inline: true,
          },
          {
            name: `Surcord Win % :`,
            value: `${
              (SelfTargetData.wins /
                (SelfTargetData.wins + SelfTargetData.defeats)) *
              100
            }%`,
            inline: true,
          }
        );

      await message.channel.send({ embeds: [Eembed] });
    } else if (
      SelfTargetData.points + wPoint > 2000 &&
      SelfTargetData.points + wPoint < 3000
    ) {
      await profileModels.updateOne(
        { userID: message.author.id },
        { $inc: { points: +wPoint, wins: +1 }, rank: "Gold" }
      );

      const Eembed = new Discord.MessageEmbed();

      Eembed.setTitle(`${message.author.tag} Surcord Ranking Profile`)
        .setColor("YELLOW")
        .setThumbnail(message.author.avatarURL({ dynamic: true }))
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.points} -> ${SelfTargetData.points + wPoint}`,
          true
        )
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.rank} -> Gold`,
          true
        )
        .addFields(
          {
            name: `Wins :`,
            value: `${SelfTargetData.wins} -> ${SelfTargetData.wins + 1} `,
            inline: true,
          },
          {
            name: `Defeats :`,
            value: `${SelfTargetData.defeats} `,
            inline: true,
          },
          {
            name: `Surcord Win % :`,
            value: `${
              (SelfTargetData.wins /
                (SelfTargetData.wins + SelfTargetData.defeats)) *
              100
            }%`,
            inline: true,
          }
        );

      await message.channel.send({ embeds: [Eembed] });
    } else if (
      SelfTargetData.points + wPoint > 3000 &&
      SelfTargetData.points + wPoint < 4000
    ) {
      await profileModels.updateOne(
        { userID: message.author.id },
        { $inc: { points: +wPoint, wins: +1 }, rank: "Platinum" }
      );

      const Eembed = new Discord.MessageEmbed();

      Eembed.setTitle(`${message.author.tag} Surcord Ranking Profile`)
        .setColor("YELLOW")
        .setThumbnail(message.author.avatarURL({ dynamic: true }))
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.points} -> ${SelfTargetData.points + wPoint}`,
          true
        )
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.rank} -> Platinum`,
          true
        )
        .addFields(
          {
            name: `Wins :`,
            value: `${SelfTargetData.wins} -> ${SelfTargetData.wins + 1} `,
            inline: true,
          },
          {
            name: `Defeats :`,
            value: `${SelfTargetData.defeats} `,
            inline: true,
          },
          {
            name: `Surcord Win % :`,
            value: `${
              (SelfTargetData.wins /
                (SelfTargetData.wins + SelfTargetData.defeats)) *
              100
            }%`,
            inline: true,
          }
        );

      await message.channel.send({ embeds: [Eembed] });
    } else if (
      SelfTargetData.points + wPoint > 4000 &&
      SelfTargetData.points + wPoint < 5000
    ) {
      await profileModels.updateOne(
        { userID: message.author.id },
        { $inc: { points: +wPoint, wins: +1 }, rank: "Diamond" }
      );

      const Eembed = new Discord.MessageEmbed();

      Eembed.setTitle(`${message.author.tag} Surcord Ranking Profile`)
        .setColor("YELLOW")
        .setThumbnail(message.author.avatarURL({ dynamic: true }))
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.points} -> ${SelfTargetData.points + wPoint}`,
          true
        )
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.rank} -> Diamond`,
          true
        )
        .addFields(
          {
            name: `Wins :`,
            value: `${SelfTargetData.wins} -> ${SelfTargetData.wins + 1} `,
            inline: true,
          },
          {
            name: `Defeats :`,
            value: `${SelfTargetData.defeats} `,
            inline: true,
          },
          {
            name: `Surcord Win % :`,
            value: `${
              (SelfTargetData.wins /
                (SelfTargetData.wins + SelfTargetData.defeats)) *
              100
            }%`,
            inline: true,
          }
        );

      await message.channel.send({ embeds: [Eembed] });
    } else if (
      SelfTargetData.points + wPoint > 5000 &&
      SelfTargetData.points + wPoint < 6000
    ) {
      await profileModels.updateOne(
        { userID: message.author.id },
        { $inc: { points: +wPoint, wins: +1 }, rank: "Hidden Boss" }
      );

      const Eembed = new Discord.MessageEmbed();

      Eembed.setTitle(`${message.author.tag} Surcord Ranking Profile`)
        .setColor("YELLOW")
        .setThumbnail(message.author.avatarURL({ dynamic: true }))
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.points} -> ${SelfTargetData.points + wPoint}`,
          true
        )
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.rank} -> Hidden Boss`,
          true
        )
        .addFields(
          {
            name: `Wins :`,
            value: `${SelfTargetData.wins} -> ${SelfTargetData.wins + 1} `,
            inline: true,
          },
          {
            name: `Defeats :`,
            value: `${SelfTargetData.defeats} `,
            inline: true,
          },
          {
            name: `Surcord Win % :`,
            value: `${
              (SelfTargetData.wins /
                (SelfTargetData.wins + SelfTargetData.defeats)) *
              100
            }%`,
            inline: true,
          }
        );

      await message.channel.send({ embeds: [Eembed] });
    } else if (SelfTargetData.points + wPoint > 6000) {
      await profileModels.updateOne(
        { userID: message.author.id },
        { $inc: { points: +wPoint, wins: +1 }, rank: "Top Player" }
      );

      const Eembed = new Discord.MessageEmbed();

      Eembed.setTitle(`${message.author.tag} Surcord Ranking Profile`)
        .setColor("YELLOW")
        .setThumbnail(message.author.avatarURL({ dynamic: true }))
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.points} -> ${SelfTargetData.points + wPoint}`,
          true
        )
        .addField(
          `Surcord ranking Points :`,
          `${SelfTargetData.rank} -> Top Player`,
          true
        )
        .addFields(
          {
            name: `Wins :`,
            value: `${SelfTargetData.wins} -> ${SelfTargetData.wins + 1} `,
            inline: true,
          },
          {
            name: `Defeats :`,
            value: `${SelfTargetData.defeats} `,
            inline: true,
          },
          {
            name: `Surcord Win % :`,
            value: `${
              (SelfTargetData.wins /
                (SelfTargetData.wins + SelfTargetData.defeats)) *
              100
            }%`,
            inline: true,
          }
        );

      await message.channel.send({ embeds: [Eembed] });
    }
  },
});
