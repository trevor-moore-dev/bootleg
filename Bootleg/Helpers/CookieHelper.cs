﻿using Microsoft.AspNetCore.Http;
using System;

// Trevor Moore
// CST-451
// 2/7/2020
// This is my own work.

namespace Bootleg.Helpers
{
	/// <summary>
	/// Cookie helper class to hold all "helper" methods concerning browser cookies.
	/// </summary>
	public class CookieHelper
	{
		/// <summary>
		/// Static method that will add a cookie to the response.
		/// </summary>
		/// <param name="response">The response of the request.</param>
		/// <param name="key">The key name of the cookie.</param>
		/// <param name="value">The value of the cookie.</param>
		/// <param name="expireTime">Optional desired expire time in minutes. Default is 1 month.</param>
		public static void AddCookie(HttpResponse response, string key, string value, int? expireTime = null)
		{
			// Append the cookie to the response with the key, value, and expire time:
			response.Cookies.Append
			(
				key,
				value,
				new CookieOptions()
				{
					Expires = expireTime.HasValue ? DateTime.UtcNow.AddMinutes(expireTime.Value) : DateTime.UtcNow.AddMonths(1),
					IsEssential = true,
					SameSite = SameSiteMode.None,
					Secure = true
				}
			);
		}
		/// <summary>
		/// Method for removing a cookie from the HttpResponse.
		/// </summary>
		/// <param name="response">HttpResponse object.</param>
		/// <param name="key">String of the key of the cookie to be removed.</param>
		public static void RemoveCookie(HttpResponse response, string key)
		{
			// Delete the cookie from the response:
			response.Cookies.Delete(key);
		}
	}
}
