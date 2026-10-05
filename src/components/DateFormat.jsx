export default function DateFormat({date, defaultView='-'}) {
  

  if (!date) {
  return defaultView
  }
  const d = new Date(date)
  if (isNaN(d.getTime())) {
  
    return defaultView
  }
  return Intl.DateTimeFormat('hr-HR', {

    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d)

}