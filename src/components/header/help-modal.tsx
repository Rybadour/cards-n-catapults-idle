import VerticalTabs, { Tab } from "../../shared/components/vertical-tabs";

import './help-modal.scss';

function HelpModal() {

  const helpTabs: Tab[] = [{
    title: 'Controls',
    content: <>
      <h3>Controls</h3>

      <p>To place a card select it by clicking on it then <b>left clicking on the grid</b>. If a card is already in that
      space it will <b>replace it</b> and the existing card will <b>go back to your inventory</b>.</p>

      <p>To remove a card from the grid you <b>right click it</b>.</p>

      <p>When removing a food card it will <b>retain its remaining capacity</b> in the form of a decimal number. Ex. If
      you remove a food card at half capacity it will be returned to your inventory as 0.5 of a card. When placing
      a food card you can place that fraction of a card and it will place it at the remaining capacity.</p>
    </>
  }, {
    title: 'Food Drain',
    content: <>
      <h3>Food Drain</h3>

      <p>You&apos;ll find that most person cards (Beggars and Peasants) and some special cards will have a food drain stat.
      This is the rate at which they eat food and it&apos;s always listed as per second. Cards generally eat food that is
      adjacent to them (orthogonally) and will eat food from all those cards at an equal rate.</p>

      <p>Ex. In these screenshots we have a Beggar next to one food card and another Beggar surrounded by food cards.</p>

      <img height="200" src="food-drain-screenshot1.png" />

      <p>A Beggar eats food at 0.2 units per second so in the first screenshot it will eat that food card at 0.2
      units per second. In the second since it&apos;s surrounded by 4 food cards each will be drained at <b>¼ the speed</b> or
      0.05 units per second. This means that each food card will <b>last 4 times as long.</b></p>
    </>
  }, {
    title: 'Reserved Food Slots',
    content: <>
      <h3>Reserved Food Slots</h3>

      <img className="float-right" height="200" src="reserved-food-screenshot.png" />

      <p className="flow-around">You may notice that when food is completely used up it sometimes remains as faded out. In this state the card
      is just a placeholder for being automatically replaced. Some cards like the campfire will automatically place food
      cards into these tiles. Cards that generate cards adjacent to them such as Rat Den or Forager will not override
      these tiles but they can place cards here that match the reservation. A tile can only be reserved this way by
      manually placing cards.</p>
    </>
  }, {
    title: 'Card Production',
    content: <>
      <h3>Cards that Produce Cards</h3>

      <p>Some cards will constantly produce cards for free. Generally they place these cards in adjacent tiles
      (orthogonally) but sometimes they send them straight to your inventory such as with the Pig Pen. If all
      adjacent tiles are occupied the produced card will go into the inventory.</p>
    </>
  }, {
    title: 'Bonuses',
    content: <>
      <h3>Bonuses</h3>

      <p>Some cards mention &quot;improving&quot; other cards. This means to increase their production by that amount or to
      speed up their abilities by that amount. Production bonuses are applied multiplicatively. You can tell if a
      card is apply a bonus to another card by hovering over the bonus applying card. Cards that it&apos;s applying a
      bonus to will be highlighted green.</p>
    </>
  }, {
    title: "Card Mastery",
    content: <>
      <h3>Card Mastery</h3>

      <img className="float-right" src="card-mastery-screenshot.png" />

      <p className="flow-around">Once unlocked each card in the standard grid can be upgraded permanently by sacrificing cards. To access
      the card mastery modal click the mastery button to the left of the card while hovering it.</p>

      <p className="flow-around">Each mastery level increases the bonus to all the card&apos;s abilities. This includes speeding up a card&apos;s
      cooldown, resource generation, food capacity and the bonuses it applies. It does not increase the amount
      of cards produced and does not reduce how much food a card consumes.</p>

      <p>Mastery levels are permanent, they persist through prestiges.</p>

      <p>When you prestige you will be given an option to automatically sacrifice all cards for a mastery bonus so don&apos;t worry about doing that
      yourself before you prestige!</p>
    </>
  }];

  return <div>
    <h2>Help tips</h2>
    <VerticalTabs tabs={helpTabs} />
  </div>;
}

export default HelpModal;