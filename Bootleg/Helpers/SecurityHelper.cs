using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;
using System.Security.Cryptography;

// Trevor Moore
// CST-451
// 12/9/2019
// I used source code from the following websites to complete this assignment:
// https://docs.microsoft.com/en-us/aspnet/core/security/data-protection/consumer-apis/password-hashing?view=aspnetcore-3.0
// ^^^ Used for the EncryptPassword() and GenerateSalt() methods.
// https://stackoverflow.com/questions/38995379/alternative-to-system-web-security-membership-generatepassword-in-aspnetcore-ne
// ^^^ Used for the Punctuations property and the GenerateRandomPassword() method.

namespace Bootleg.Helpers
{
    /// <summary>
    /// Security helper class for all "helper" methods concerning security.
    /// </summary>
	public class SecurityHelper
	{
        // Private static readonly character array of punctuations that we want allowed in the temporary passwords:
        private static readonly char[] Punctuations = "!@#$%^&*()_-+=[{]};:>|./?".ToCharArray();
        /// <summary>
        /// Method for hashing passwords with salt.
        /// </summary>
        /// <param name="password">Password in plain text/normal string format.</param>
        /// <param name="salt">Byte array of "salt".</param>
        /// <returns>Hashed password+salt as string.</returns>
        public static string EncryptPassword(string password, byte[] salt)
		{
            // Hash the password with the salt using the PBKDF2 algorithm:
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA1,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
        }
        /// <summary>
        /// Method for generating salt using cryptographically random numbers.
        /// </summary>
        /// <returns>Byte array filled with "salt".</returns>
        public static byte[] GenerateSalt()
        {
            // Instantiate byte array to hold salt values:
            byte[] salt = new byte[128 / 8];
            // Use RandomNumberGenerator to create cryptographically random numbers:
            using (var rng = RandomNumberGenerator.Create())
            {
                // Fill the array of bytes with a cryptographically string random sequence of numbers using the RandomNumberGenerator:
                rng.GetBytes(salt);
            }
            // Return the byte array:
            return salt;
        }
        /// <summary>
        /// Method for generating a random password for temporary use in the system.
        /// </summary>
        /// <param name="length">Desired length of the password. Default is 12.</param>
        /// <param name="numberOfNonAlphanumericCharacters">Desired number of non-alphanumeric characters. Default is 3.</param>
        /// <returns>The random password as a string.</returns>
        public static string GenerateRandomPassword(int length = 12, int numberOfNonAlphanumericCharacters = 3)
        {
            // If length is not valid, throw argument exception:
            if (length < 1 || length > 128)
            {
                throw new ArgumentException(nameof(length));
            }
            // If desired number of non-alphanumeric characters is not valid, throw argument exception:
            if (numberOfNonAlphanumericCharacters > length || numberOfNonAlphanumericCharacters < 0)
            {
                throw new ArgumentException(nameof(numberOfNonAlphanumericCharacters));
            }
            // Use RandomNumberGenerator to create cryptographically random numbers:
            using (var rng = RandomNumberGenerator.Create())
            {
                // Instantiate byte array to be used as a buffer:
                var byteBuffer = new byte[length];
                // Fill the buffer with random numbers using the RandomNumberGenerator:
                rng.GetBytes(byteBuffer);
                // Instantiate counter and character buffer as char array for holding the random password:
                var count = 0;
                var characterBuffer = new char[length];
                // Iterate through the desired length of the password:
                for (var iter = 0; iter < length; iter++)
                {
                    // Get random value from the buffer filled with cryptographically random numbers:
                    var i = byteBuffer[iter] % 87;
                    // Depending on value of i, get a character value by combining i with 0, A, or a to create a hexidecimal prefix:
                    // If i is less than 10:
                    if (i < 10)
                    {
                        // Set a character in the temprorary password using i and 0 for a hexidecimal prefix:
                        characterBuffer[iter] = (char)('0' + i);
                    }
                    // Else if i is less than 36:
                    else if (i < 36)
                    {
                        // Set a character in the temprorary password using i and A for a hexidecimal prefix:
                        characterBuffer[iter] = (char)('A' + i - 10);
                    }
                    // Else if i is less than 62:
                    else if (i < 62)
                    {
                        // Set a character in the temprorary password using i and a for a hexidecimal prefix:
                        characterBuffer[iter] = (char)('a' + i - 36);
                    }
                    // Else:
                    else
                    {
                        // Grab a value from the allowed punctuations and increment the count:
                        characterBuffer[iter] = Punctuations[i - 62];
                        count++;
                    }
                }
                // If we already filled the required number of non-alphanumeric characters, return the char array as a string:
                if (count >= numberOfNonAlphanumericCharacters)
                {
                    return new string(characterBuffer);
                }
                // Initialize index 'j' and random number:
                int j;
                var rand = new Random();
                // Loop through number of non-alphanumeric characters minus the number we already added:
                for (j = 0; j < numberOfNonAlphanumericCharacters - count; j++)
                {
                    // Initialize index 'k':
                    int k;
                    // Set value of k while its index in the character array is not a letter or digit:
                    do
                    {
                        k = rand.Next(0, length);
                    }
                    while (!char.IsLetterOrDigit(characterBuffer[k]));
                    // Set the index of k to a random punctuation:
                    characterBuffer[k] = Punctuations[rand.Next(0, Punctuations.Length)];
                }
                // Return the character array as a string:
                return new string(characterBuffer);
            }
        }
    }
}