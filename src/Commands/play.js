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
          });
        });
    }

    await message.channel.send(
      `Hey ${target}, <@${message.author.id}> Reported your match result
      `
    );

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
    if (targetData.points < 45) {
      await profileModels.updateOne(
        { userID: targetData.userID },
        { points: 0, $inc: { defeats: 1 } }
      );
    } else {
      await profileModels.updateOne(
        { userID: targetData.userID },
        {
          $inc: {
            points: -45,
            defeats: +1,
          },
        }
      );
    }

    await profileModels.updateOne(
      { userID: message.author.id },
      { $inc: { points: +95, wins: +1 } }
    );
  },
});
