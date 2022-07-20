import './card-buttons.scss';

export function CardButton(props: {label: string}) {
  return <button className="card-button">
    {props.label}
  </button>;
}

export function CardButtons(props: {children: JSX.Element}) {
  return <div className="card-buttons">
    {props.children}
  </div>;
}