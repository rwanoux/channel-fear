

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class ChannelFearActor extends Actor {

  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData() {
    super.prepareData();

    const actorData = this.data;
    const data = actorData.data;
    const flags = actorData.flags;


    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'character') this._prepareCharacterData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {

    let data = actorData;


      if (data.data.compteurs.santé.value > 2) {
        data.data.diffSante = 0
      };
      if (data.data.compteurs.santé.value === 2) {
        data.data.diffSante = 1
      };
      if (data.data.compteurs.santé.value === 1) {
        data.data.diffSante = 2
      }
      if (data.data.compteurs.santé.value === 0) {
        console.log("aaaaaaaaaaaaaaaaaarrrrrrrrrrrrrrrggggggggggg");
      }
  

    // Make modifications to data here. For example:
    // Loop through ability scores, and add their modifiers to our sheet output.
 

    //checker le niv de santé pour appliquer les malus aux jets

  }


  

};