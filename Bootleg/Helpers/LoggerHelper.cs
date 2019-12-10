using System;

// Trevor Moore
// CST-451
// 12/9/2019
// Coded in collaboration with Jordan Riley at OpportunityHack 2019. Class is "boiler plate" / standard / reusable code.

namespace Bootleg.Helpers
{
    /// <summary>
    /// Logging helper class for all "helper" methods concerning logging.
    /// </summary>
	public class LoggerHelper
    {
        /// <summary>
        /// Method for logging exceptions in a standard format.
        /// </summary>
        /// <param name="ex">The exception to log.</param>
        public static void Log(Exception ex)
        {
            // Log the date and time with the exception message and stack trace:
            Serilog.Log.Debug("ERROR --- " + DateTime.Now.ToString() + " : " + ex.Message);
            Serilog.Log.Debug("ERROR --- " + DateTime.Now.ToString() + " : " + ex.StackTrace);
            // If the exception is not null:
            if (ex.InnerException != null)
            {
                // Log the date and time with the inner exception message and inner stack trace:
                Serilog.Log.Debug("ERROR INNER --- " + DateTime.Now.ToString() + " : " + ex.InnerException.Message);
                Serilog.Log.Debug("ERROR INNER --- " + DateTime.Now.ToString() + " : " + ex.InnerException.StackTrace);
            }
        }
        /// <summary>
        /// Method for logging any string message in a standard format.
        /// </summary>
        /// <param name="msg">String message to log.</param>
        public static void Log(string msg)
        {
            // Log the date and time with the messsage:
            Serilog.Log.Information("INFO --- " + DateTime.Now.ToString() + " : " + msg);
        }
    }
}