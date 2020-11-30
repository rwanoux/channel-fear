import {
  rollCF
} from "../rolls/rollCF.js";
import {
  toChat
} from "../rolls/toChat.js";


/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class ChannelFearActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["channelfear", "sheet", "actor"],
      template: "systems/ChannelFear/templates/actor/actor-personnage-sheet.html",
      width: 1200,
      height: 740,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "description"
      }]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const data = super.getData();
    data.dtypes = ["String", "Number", "Boolean"];
    // Prepare items.
    if (this.actor.data.type == 'personnage') {
      this._prepareCharacterItems(data);
    }
    return data;
  }

  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;


    return actorData;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {


    let data = this.actor.data.data;
    let actor = this.actor;


    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities.
    html.find('.rollable').click(this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.owner) {
      let handler = ev => this._onDragItemStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
    //------santé et ressource max 6


    // ----------rolls------------------
    html.find(".boutonApt").click(ev => {

      let apt = ev.target.getAttribute("rollCF");
      console.log(apt);
      rollCF(actor, apt);
    });

    html.find(".boutonSpe").click(ev => {
      let apt = ev.target.getAttribute("rollCF");
      console.log(apt);
      let spe=ev.target.getAttribute("rollSpe");
      let relanceDispo = ev.target.getAttribute("rollRelances");
      rollCF(actor, apt, relanceDispo,spe);
    });
    html.find(".boutondgt").click(ev => {
      let apt = ev.target.getAttribute("rollCF");
      console.log(apt);
      let spe=ev.target.getAttribute("rollSpe");
      let dgt=ev.target.getAttribute("rollDegats");
      let relanceDispo = ev.target.getAttribute("rollRelances");
      rollCF(actor, apt, relanceDispo,spe,dgt);
    });

    //---------to chat
    html.find(".toChat").click(ev => {
      let content = ev.target.getAttribute("chatData");
      toChat(content);
    });
  }


  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  _onItemCreate(event) {
    event.preventDefault();
    //const header = event.currentTarget.previousSiblingElement.innerText;
    // Get the type of item to create.
    const type = event.currentTarget.previousSiblingElement.innerText;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      data: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.data["type"];

    // Finally, create the item!
    return this.actor.createOwnedItem(itemData);
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    if (dataset.roll) {
      let roll = new Roll(dataset.roll, this.actor.data.data);
      let label = dataset.label ? `Rolling ${dataset.label}` : '';
      roll.roll().toMessage({
        speaker: ChatMessage.getSpeaker({
          actor: this.actor
        }),
        flavor: label
      });
    }
  }

}

