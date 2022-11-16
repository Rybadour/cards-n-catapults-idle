import classNames from 'classnames';
import './progress-bar.css';

type ProgressBarProps = {
  progress: number,
  color: string,
  noBorder: boolean,  
  height?: number,
}

export function ProgressBar(props: ProgressBarProps) {
  const height = props.height ?? 10;

  return (
    <div className={classNames("progress", {"no-border": props.noBorder})} style={{height: height + "px"}}>
      <div className="progress-bar" style={{
        width: (Math.min(props.progress, 1) * 100) + "%",
        backgroundColor: props.color,
      }}></div>
    </div>
  );
}