

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
    


    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'personnage') this._prepareCharacterData(actorData);
  return actorData;
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    
    let data = actorData;

//checker le niv de santé pour appliquer les malus aux jets
      if (data.data.compteurs.santé.value > 2) {
        data.data.diffSante = 0;
      }
      if (data.data.compteurs.santé.value === 2) {
        data.data.diffSante = 1;
      }
      if (data.data.compteurs.santé.value === 1) {
        data.data.diffSante = 2;
      }
      if (data.data.compteurs.santé.value === 0) {
        console.log("aaaaaaaaaaaaaaaaaarrrrrrrrrrrrrrrggggggggggg");
      }

      //---brider les compteurs

      if (data.data.compteurs.santé.value >6) {
        data.data.compteurs.santé.value =6;
      }
      if (data.data.compteurs.ressource.value >6) {
        data.data.compteurs.ressource.value =6;
      }

    // Make modifications to data here. For example:
    // Loop through ability scores, and add their modifiers to our sheet output.
 

    return data;

  }


  

}