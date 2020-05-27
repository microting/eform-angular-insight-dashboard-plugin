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

namespace InsightDashboard.Pn.Test.Helpers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.EntityFrameworkCore;
    using Microting.eForm.Infrastructure;
    using Microting.eForm.Infrastructure.Data.Entities;
    using NUnit.Framework;

    public static class DatabaseHelper
    {
        public static async Task AddTotalTag(MicrotingDbContext dbContext)
        {
            if (!await dbContext.tags.AnyAsync(
                x => x.Name == "Total"
                     && x.Id == 1))
            {
                var tag = new tags()
                {
                    Name = "Total",
                };

                await tag.Create(dbContext);
            }
            else
            {
                Assert.Fail("Total tag already exists in database");
            }

            var locations = new List<site_tags>()
            {
                new site_tags()
                {
                    SiteId = 1,
                    TagId = 1,
                },
                new site_tags()
                {
                    SiteId = 2,
                    TagId = 1,
                },
                new site_tags()
                {
                    SiteId = 3,
                    TagId = 1,
                },
                new site_tags()
                {
                    SiteId = 4,
                    TagId = 1,
                },
            };

            foreach (var siteTag in locations)
            {
                if (!await dbContext.SiteTags.AnyAsync(
                    x => x.SiteId == siteTag.SiteId
                         && x.TagId == siteTag.TagId))
                {
                    await siteTag.Create(dbContext);
                }
                else
                {
                    Assert.Fail("Site tag already exists in database");
                }
            }
        }
    }
}