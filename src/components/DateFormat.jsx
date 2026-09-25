export default function DateFormat(dateValue, defaultView='-') {
  

  if (!dateValue) {
  return defaultView
  }
  const d = new Date(dateValue)
console.log(d)
  if (isNaN(d.getTime())) {
  
    return defaultView
  }
  return Intl.DateTimeFormat('hr-HR', {

    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d)

}