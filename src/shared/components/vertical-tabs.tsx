import classNames from "classnames";
import { useState } from "react";

import './vertical-tabs.scss';

export type Tab = {
  title: string,
  content: JSX.Element,
}

function VerticalTabs(props: {tabs: Tab[]}) {
  const [selected, setSelected] = useState(0);

  return <div className="tabs-container">
    <ul className="tabs-list">
      {props.tabs.map((tab, i) => 
        <li
          className={classNames({selected: i == selected})}
          onClick={() => setSelected(i)}
          key={i}
        >{tab.title}</li>
      )}
    </ul>
    <div className="tab-content-wrapper">
      {props.tabs.map((tab, i) => 
        <div key={i} className={classNames('tab-content', {selected: selected == i})}>
          {tab.content}
        </div>
      )}
    </div>
  </div>
}

export default VerticalTabs;