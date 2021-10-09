const Command = require("../Structures/Command.js");
const profileModels = require("../Structures/profileSchema.js");
const Discord = require("discord.js");

module.exports = new Command({
  name: "reset",
  description: "choose a user to reset",
  parameters: "<user_Target>",
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
      `Hey ${target}, <@${message.author.id}> reseted your stats!
          `
    );

    await profileModels.updateOne(
      { userID: targetData.userID },
      {
        points: 0,
        wins: 0,
        defeats: 0,
      }
    );
  },
});
