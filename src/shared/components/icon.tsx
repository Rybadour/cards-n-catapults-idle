import './icon.scss';

export default function Icon(props: {size: string, icon: string}) {
  return <div className={"icon icon--" + props.size}>
    <i className={props.icon}></i>
  </div>
}