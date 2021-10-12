const Command = require("../Structures/Command.js");
const profileModels = require("../Structures/profileSchema.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "mod",
  description: "choose a user to modify their stats",
  parameters: "<user_Target> <Points +-> <wins+-> <defeats+->",
  permission: "SEND_MESSAGES",
  permission: "ADMINISTRATOR",

  async run(message, args, cmd, client, discord, profileData) {
    // console.log(args[1] + " this is the user @mentioned");
    //console.log(args[2] + " this is the args amount of points");
    //console.log(args[3] + " this is the args of wins");
    //console.log(args[4] + " this is the args of defeats");

    const target = message.mentions.users.first();

    if (!args.length)
      return message.channel.send("You need to mention a player to modify");

    if (!target) return message.channel.send("That user does not exist");

    const targetData = await profileModels.findOne({ userID: target.id });

    if (!targetData) {
      return message.channel.send(
        "Target user does not have a Ranking profile\n"
      );
    }

    await message.channel.send(
      `Hey ${target}, <@${message.author.id}> Modified your stats!
      `
    );

    if (args[2] == undefined) {
      args[2] = 0;
    }
    if (args[3] == undefined) {
      args[3] = 0;
    }
    if (args[4] == undefined) {
      args[4] = 0;
    }

    await profileModels.updateOne(
      { userID: targetData.userID },
      {
        $inc: {
          points: args[2],
          wins: args[3],
          defeats: args[4],
        },
      }
    );
  },
});
