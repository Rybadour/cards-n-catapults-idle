import './progress-bar.css';

export function ProgressBar(props: { progress: number }) {
  return (
    <div className="progress">
      <div className="progress-bar" style={{ width: props.progress * 100 + "%" }}></div>
    </div>
  );
}