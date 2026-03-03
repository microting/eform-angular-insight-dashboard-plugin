/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

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
namespace InsightDashboard.Pn.Services.WordService;

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using A = DocumentFormat.OpenXml.Drawing;
using DW = DocumentFormat.OpenXml.Drawing.Wordprocessing;
using PIC = DocumentFormat.OpenXml.Drawing.Pictures;
using Break = DocumentFormat.OpenXml.Wordprocessing.Break;
using Paragraph = DocumentFormat.OpenXml.Wordprocessing.Paragraph;
using ParagraphProperties = DocumentFormat.OpenXml.Wordprocessing.ParagraphProperties;
using Run = DocumentFormat.OpenXml.Wordprocessing.Run;
using RunProperties = DocumentFormat.OpenXml.Wordprocessing.RunProperties;
using Table = DocumentFormat.OpenXml.Wordprocessing.Table;
using TableCell = DocumentFormat.OpenXml.Wordprocessing.TableCell;
using TableCellProperties = DocumentFormat.OpenXml.Wordprocessing.TableCellProperties;
using TableProperties = DocumentFormat.OpenXml.Wordprocessing.TableProperties;
using TableRow = DocumentFormat.OpenXml.Wordprocessing.TableRow;
using Text = DocumentFormat.OpenXml.Wordprocessing.Text;
using TopBorder = DocumentFormat.OpenXml.Wordprocessing.TopBorder;
using BottomBorder = DocumentFormat.OpenXml.Wordprocessing.BottomBorder;
using LeftBorder = DocumentFormat.OpenXml.Wordprocessing.LeftBorder;
using RightBorder = DocumentFormat.OpenXml.Wordprocessing.RightBorder;
using InsideHorizontalBorder = DocumentFormat.OpenXml.Wordprocessing.InsideHorizontalBorder;
using InsideVerticalBorder = DocumentFormat.OpenXml.Wordprocessing.InsideVerticalBorder;

public class WordProcessor : IDisposable
{
    // A4 dimensions in twips
    private const int PageWidthTwips = 11906;
    private const int PageHeightTwips = 16838;
    private const int PageMarginLeftTwips = 1440;   // 1 inch
    private const int PageMarginRightTwips = 1440;
    private const int PageMarginTopTwips = 1440;
    private const int PageMarginBottomTwips = 1440;

    // EMU conversions: 1 inch = 914400 EMUs, 1 inch = 1440 twips
    private const long EmuPerInch = 914400L;
    private const long EmuPerPixel = 9525L; // 914400 / 96 dpi

    // Maximum available content width in EMUs
    private static readonly long MaxContentWidthEmu =
        (long)((PageWidthTwips - PageMarginLeftTwips - PageMarginRightTwips) * (EmuPerInch / 1440.0));

    private readonly WordprocessingDocument _wordProcessingDocument;
    private readonly Body _body;

    public WordProcessor(Stream stream)
    {
        _wordProcessingDocument = WordprocessingDocument.Open(stream, true);

        var mainPart = _wordProcessingDocument.MainDocumentPart;
        if (mainPart == null)
        {
            mainPart = _wordProcessingDocument.AddMainDocumentPart();
            new Document(new Body()).Save(mainPart);
        }

        _body = mainPart.Document.Body!;

        // Ensure section properties with A4 page size and margins
        EnsureSectionProperties();
    }

    /// <summary>
    /// Ensures the document body has correct A4 section properties.
    /// </summary>
    private void EnsureSectionProperties()
    {
        var sectionProps = _body.Elements<SectionProperties>().FirstOrDefault();
        if (sectionProps == null)
        {
            sectionProps = new SectionProperties();
            _body.AppendChild(sectionProps);
        }

        if (sectionProps.GetFirstChild<PageSize>() == null)
        {
            sectionProps.AppendChild(new PageSize
            {
                Width = (UInt32Value)(uint)PageWidthTwips,
                Height = (UInt32Value)(uint)PageHeightTwips
            });
        }

        if (sectionProps.GetFirstChild<PageMargin>() == null)
        {
            sectionProps.AppendChild(new PageMargin
            {
                Left = (UInt32Value)(uint)PageMarginLeftTwips,
                Right = (UInt32Value)(uint)PageMarginRightTwips,
                Top = PageMarginTopTwips,
                Bottom = PageMarginBottomTwips
            });
        }
    }

    /// <summary>
    /// Adds a page break before the next content.
    /// </summary>
    public void AddPageBreak()
    {
        var paragraph = new Paragraph(
            new Run(
                new Break { Type = BreakValues.Page }
            )
        );
        AppendBeforeSectionProperties(paragraph);
    }

    /// <summary>
    /// Adds a text paragraph with optional bold styling.
    /// </summary>
    public void AddTextParagraph(string text, bool bold = false)
    {
        var run = new Run();

        if (bold)
        {
            run.RunProperties = new RunProperties(new Bold());
        }

        run.AppendChild(new Text(text) { Space = SpaceProcessingModeValues.Preserve });

        var paragraph = new Paragraph(run);
        AppendBeforeSectionProperties(paragraph);
    }

    /// <summary>
    /// Adds a label-value paragraph: "<bold>label:</bold> value"
    /// </summary>
    public void AddLabelValueParagraph(string label, string value)
    {
        var paragraph = new Paragraph(
            new Run(
                new RunProperties(new Bold()),
                new Text(label + ": ") { Space = SpaceProcessingModeValues.Preserve }
            ),
            new Run(
                new Text(value) { Space = SpaceProcessingModeValues.Preserve }
            )
        );

        AppendBeforeSectionProperties(paragraph);
    }

    /// <summary>
    /// Adds a PNG image from a byte array, scaled to fit within the page content width.
    /// </summary>
    public void AddImage(byte[] imageBytes)
    {
        var mainPart = _wordProcessingDocument.MainDocumentPart!;
        var imagePart = mainPart.AddImagePart(ImagePartType.Png);

        using (var imageStream = new MemoryStream(imageBytes))
        {
            imagePart.FeedData(imageStream);
        }

        // Get image dimensions
        GetImageDimensions(imageBytes, out var pixelWidth, out var pixelHeight);

        // Convert to EMUs
        long emuWidth = pixelWidth * EmuPerPixel;
        long emuHeight = pixelHeight * EmuPerPixel;

        // Scale down to fit page width if needed
        if (emuWidth > MaxContentWidthEmu)
        {
            var scale = (double)MaxContentWidthEmu / emuWidth;
            emuWidth = MaxContentWidthEmu;
            emuHeight = (long)(emuHeight * scale);
        }

        var relationshipId = mainPart.GetIdOfPart(imagePart);

        var drawing = CreateImageDrawing(relationshipId, emuWidth, emuHeight);

        var paragraph = new Paragraph(new Run(drawing));
        AppendBeforeSectionProperties(paragraph);
    }

    /// <summary>
    /// Adds a table with the specified headers and data rows.
    /// </summary>
    public void AddTable(
        List<string> headers,
        List<List<TableCellData>> rows,
        bool headerBold = true)
    {
        var table = new Table();

        // Table properties with borders
        var tableProperties = new TableProperties(
            new TableBorders(
                new TopBorder { Val = BorderValues.Single, Size = 4 },
                new BottomBorder { Val = BorderValues.Single, Size = 4 },
                new LeftBorder { Val = BorderValues.Single, Size = 4 },
                new RightBorder { Val = BorderValues.Single, Size = 4 },
                new InsideHorizontalBorder { Val = BorderValues.Single, Size = 4 },
                new InsideVerticalBorder { Val = BorderValues.Single, Size = 4 }
            ),
            new TableWidth { Type = TableWidthUnitValues.Pct, Width = "5000" } // 100% width
        );
        table.AppendChild(tableProperties);

        // Header row
        if (headers.Count > 0)
        {
            var headerRow = new TableRow();
            foreach (var header in headers)
            {
                headerRow.AppendChild(CreateTableCell(header, bold: headerBold, grayBackground: true));
            }
            table.AppendChild(headerRow);
        }

        // Data rows
        foreach (var row in rows)
        {
            var tableRow = new TableRow();
            foreach (var cellData in row)
            {
                var cell = CreateTableCell(
                    cellData.Text,
                    bold: cellData.Bold,
                    grayBackground: cellData.GrayBackground,
                    rowSpan: cellData.RowSpan
                );
                tableRow.AppendChild(cell);
            }
            table.AppendChild(tableRow);
        }

        AppendBeforeSectionProperties(table);

        // Add spacing after table
        var spacer = new Paragraph(
            new ParagraphProperties(new SpacingBetweenLines { After = "200" })
        );
        AppendBeforeSectionProperties(spacer);
    }

    /// <summary>
    /// Adds an empty paragraph for spacing.
    /// </summary>
    public void AddEmptyParagraph()
    {
        AppendBeforeSectionProperties(new Paragraph());
    }

    /// <summary>
    /// Appends an element before the SectionProperties (required by OpenXML spec).
    /// </summary>
    private void AppendBeforeSectionProperties(OpenXmlElement element)
    {
        var sectionProps = _body.Elements<SectionProperties>().FirstOrDefault();
        if (sectionProps != null)
        {
            _body.InsertBefore(element, sectionProps);
        }
        else
        {
            _body.AppendChild(element);
        }
    }

    /// <summary>
    /// Creates a table cell with styling.
    /// </summary>
    private static TableCell CreateTableCell(string text, bool bold = false, bool grayBackground = false, int rowSpan = 0)
    {
        var run = new Run(new Text(text) { Space = SpaceProcessingModeValues.Preserve });

        if (bold)
        {
            run.RunProperties = new RunProperties(new Bold());
        }

        var cellProperties = new TableCellProperties();

        if (grayBackground)
        {
            cellProperties.AppendChild(new Shading
            {
                Val = ShadingPatternValues.Clear,
                Color = "auto",
                Fill = "F5F5F5"
            });
        }

        if (rowSpan > 1)
        {
            cellProperties.AppendChild(new VerticalMerge { Val = MergedCellValues.Restart });
        }
        else if (rowSpan == -1) // continuation of a merge
        {
            cellProperties.AppendChild(new VerticalMerge());
        }

        var cell = new TableCell();
        cell.AppendChild(cellProperties);
        cell.AppendChild(new Paragraph(run));
        return cell;
    }

    /// <summary>
    /// Creates the OpenXML Drawing element for an inline image.
    /// </summary>
    private static Drawing CreateImageDrawing(string relationshipId, long emuWidth, long emuHeight)
    {
        var element = new Drawing(
            new DW.Inline(
                new DW.Extent { Cx = emuWidth, Cy = emuHeight },
                new DW.EffectExtent { LeftEdge = 0, TopEdge = 0, RightEdge = 0, BottomEdge = 0 },
                new DW.DocProperties { Id = 1U, Name = "Picture" },
                new DW.NonVisualGraphicFrameDrawingProperties(
                    new A.GraphicFrameLocks { NoChangeAspect = true }
                ),
                new A.Graphic(
                    new A.GraphicData(
                        new PIC.Picture(
                            new PIC.NonVisualPictureProperties(
                                new PIC.NonVisualDrawingProperties { Id = 0U, Name = "Image" },
                                new PIC.NonVisualPictureDrawingProperties()
                            ),
                            new PIC.BlipFill(
                                new A.Blip
                                {
                                    Embed = relationshipId,
                                    CompressionState = A.BlipCompressionValues.Print
                                },
                                new A.Stretch(new A.FillRectangle())
                            ),
                            new PIC.ShapeProperties(
                                new A.Transform2D(
                                    new A.Offset { X = 0, Y = 0 },
                                    new A.Extents { Cx = emuWidth, Cy = emuHeight }
                                ),
                                new A.PresetGeometry(new A.AdjustValueList())
                                {
                                    Preset = A.ShapeTypeValues.Rectangle
                                }
                            )
                        )
                    )
                    { Uri = "http://schemas.openxmlformats.org/drawingml/2006/picture" }
                )
            )
            {
                DistanceFromTop = 0U,
                DistanceFromBottom = 0U,
                DistanceFromLeft = 0U,
                DistanceFromRight = 0U
            }
        );

        return element;
    }

    /// <summary>
    /// Gets image dimensions from PNG byte array.
    /// PNG header: bytes 16-19 = width, bytes 20-23 = height (big-endian).
    /// </summary>
    private static void GetImageDimensions(byte[] imageBytes, out int width, out int height)
    {
        // Default fallback
        width = 650;
        height = 400;

        if (imageBytes.Length < 24)
            return;

        // Check PNG signature
        if (imageBytes[0] == 0x89 && imageBytes[1] == 0x50 && imageBytes[2] == 0x4E && imageBytes[3] == 0x47)
        {
            // PNG: width at offset 16, height at offset 20 (big-endian 4 bytes)
            width = (imageBytes[16] << 24) | (imageBytes[17] << 16) | (imageBytes[18] << 8) | imageBytes[19];
            height = (imageBytes[20] << 24) | (imageBytes[21] << 16) | (imageBytes[22] << 8) | imageBytes[23];
        }
    }

    public void Dispose()
    {
        _wordProcessingDocument.MainDocumentPart?.Document.Save();
        _wordProcessingDocument.Save();
        _wordProcessingDocument.Dispose();
    }
}

/// <summary>
/// Data for a single table cell.
/// </summary>
public class TableCellData
{
    public string Text { get; set; } = "";
    public bool Bold { get; set; }
    public bool GrayBackground { get; set; }
    /// <summary>
    /// RowSpan > 1 = start of merge, -1 = continuation, 0 = normal cell
    /// </summary>
    public int RowSpan { get; set; }
}
