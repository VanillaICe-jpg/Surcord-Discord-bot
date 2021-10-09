const Discord = require("discord.js");

const Client = require("./Client.js");

/**
 * @template {keyof Discord.ClientEvents} K
 * @param {client} client
 * @param  {Discord.ClientEvents[K]} eventArgs
 */
function RunFunction(client, ...eventArgs) {}
/**
 * @template {keyof Discord.ClientEvents} K
 */
class Event {
  /**
   *
   * @param {K} event
   * @param {RunFunction<K>} runfunction
   */

  constructor(event, runfunction) {
    this.event = event;
    this.run = runfunction;
  }
}

module.exports = Event;
