const everysecond = "* * * * * *";
const everytensecond = "*/10 * * * * *";
const everyminute = "* * * * *";
const everyminute12 = "0 */12 * * *"; // Todos los dias cada 12 hs
const everydaynight = "0 0 * * *"; // Todos los dias a mediaNoche
const everyday = "0 0 * * SUN"; // Todos los domingos a mediaNoche
const everyweekday = "00 30 11 * * 1-5"; //Runs  (Monday through Friday) at 11:30:00 AM. It does not run on Saturday or Sunday.

// ---------( 0-59 0-59  0-23  1-31  1-12  0-7 )
// ---------( Sec  min   hour  dayMh month dayWk )
const CRON_DEFAULT = everydaynight;

 function programarFecha(fecha) {
  if (fecha == null) {
    return CRON_DEFAULT;
  } else {
    return fecha;
  }
}
module.exports = { programarFecha ,CRON_DEFAULT}

// Campos permitidos
//                    campo     |         valor

//  # ┌────────────── second (optional)	0-59
//  # │ ┌──────────── minute 	            0-59
//  # │ │ ┌────────── hour                 0-23
//  # │ │ │ ┌──────── day of month         1-31
//  # │ │ │ │ ┌────── month                1-12 (or names)
//  # │ │ │ │ │ ┌──── day of week          0-7 (or names, 0 or 7 are sunday)
//  # │ │ │ │ │ │
//  # │ │ │ │ │ │
//  # * * * * * *