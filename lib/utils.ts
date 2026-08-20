export function formatClientDate(dateInput: Date | string): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const m = months[d.getMonth()];
  const day = d.getDate();
  const y = d.getFullYear();
  let h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  const min = d.getMinutes().toString().padStart(2, '0');
  
  // Format: "Aug 20, 2026, 6:31 PM" - identical on both server and client to avoid hydration errors
  return `${m} ${day}, ${y}, ${h}:${min} ${ampm}`;
}
