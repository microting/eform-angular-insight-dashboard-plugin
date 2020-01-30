﻿/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

namespace InsightDashboard.Pn.Infrastructure.Helpers
{
    using System;
    using System.Globalization;

    public static class ChartDateHelpers
    {
        public static string GetWeekString(DateTime dateTime)
        {
            var weekNumber = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(
                dateTime,
                CalendarWeekRule.FirstFourDayWeek,
                DayOfWeek.Monday);

            return $"{dateTime:yy}-{weekNumber:D2}";
        }

        public static int GetHalfOfYear(DateTime dateTime)
        {
            var month = dateTime.Month;
            if (month > 0 && month <= 6)
            {
                return 1;
            }

            if (month > 6 && month <= 12)
            {
                return 2;
            }

            throw new ArgumentException($"Invalid month {month}");
        }
    }
}