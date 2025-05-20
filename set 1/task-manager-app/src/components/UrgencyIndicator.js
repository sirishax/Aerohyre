export default function UrgencyIndicator({ score }) {
  let label = 'Low';
  let style = 'urgency low';

  if (score < 0) {
    label = 'Critical';
    style = 'urgency critical';
  } else if (score < 1) {
    label = 'Urgent';
    style = 'urgency urgent';
  } else if (score < 3) {
    label = 'High';
    style = 'urgency high';
  } else if (score < 7) {
    label = 'Medium';
    style = 'urgency medium';
  }

  return <span className={style}>{label}</span>;
}