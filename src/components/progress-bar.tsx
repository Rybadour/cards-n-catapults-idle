import './progress-bar.css';

export function ProgressBar(props: { progress: number, color: string }) {
  return (
    <div className="progress">
      <div className="progress-bar" style={{
        width: props.progress * 100 + "%",
        backgroundColor: props.color,
      }}></div>
    </div>
  );
}