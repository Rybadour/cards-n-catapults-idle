import './header.scss';
import Modal from 'react-modal';
import { useState } from 'react';

function Header() {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return <header>
    <h1>Cards & Catapults Idle</h1>

    <div className="options">
      <button onClick={() => setIsHelpModalOpen(true)}>Help</button>
      <button>Options</button>
    </div>

    <Modal
      isOpen={isHelpModalOpen}
    >
      <h2>Help Tips</h2>
    </Modal>
  </header>;
}

export default Header;