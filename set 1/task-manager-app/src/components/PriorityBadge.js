export default function PriorityBadge({ priority }) {
  const styleMap = {
    high: 'badge badge-high',
    medium: 'badge badge-medium',
    low: 'badge badge-low',
  };
  return <span className={styleMap[priority]}>{priority.toUpperCase()}</span>;
}