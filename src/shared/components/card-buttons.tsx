import './card-buttons.scss';

export function CardButton(props: {label: React.ReactNode, onClick: () => void}) {
  return <button className="card-button" onClick={() => props.onClick()}>
    {props.label}
  </button>;
}

export function CardButtons(props: {children: React.ReactNode, width: number}) {
  return <div className="card-buttons" style={{width: props.width + "px"}}>
    {props.children}
  </div>;
}