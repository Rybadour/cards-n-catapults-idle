import './header.scss';

function Header() {
  return <header>
    <h1>Cards & Catapults Idle</h1>

    <div className="options">
      <button>Save</button>
      <button>Load</button>
      <button>Options</button>
    </div>
  </header>;
}

export default Header;