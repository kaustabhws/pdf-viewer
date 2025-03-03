"use client";

import type React from "react";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Link } from "lucide-react";

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer() {
  const [pdfUrl, setPdfUrl] = useState<string>(""); // Stores the URL input
  const [pdfFile, setPdfFile] = useState<string | null>(null); // Stores the final URL to display
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page when a new document loads
  }

  function handleUrlInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPdfUrl(event.target.value);
  }

  function handleViewPdf() {
    if (pdfUrl.trim()) {
      setPdfFile(pdfUrl);
    } else {
      alert("Please enter a valid PDF URL.");
    }
  }

  function goToPrevPage() {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  }

  function goToNextPage() {
    setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-6 space-y-6">
      {/* PDF URL Input */}
      <div className="w-full">
        <Label htmlFor="pdf-url" className="text-base font-medium">
          Enter PDF URL
        </Label>
        <div className="flex gap-2">
          <Input
            id="pdf-url"
            type="url"
            placeholder="Enter PDF URL..."
            value={pdfUrl}
            onChange={handleUrlInputChange}
            className="flex-1"
          />
          <Button variant="outline" onClick={handleViewPdf}>
            <Link className="h-4 w-4 mr-2" />
            View PDF
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      {pdfFile ? (
        <Card className="w-full overflow-hidden">
          <CardContent className="p-0 flex flex-col items-center">
            <div className="w-full overflow-auto p-4">
              <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="mx-auto"
                />
              </Document>
            </div>

            <div className="flex items-center justify-between w-full p-4 border-t">
              <Button
                onClick={goToPrevPage}
                disabled={pageNumber <= 1}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="text-sm font-medium">
                Page {pageNumber} of {numPages}
              </div>

              <Button
                onClick={goToNextPage}
                disabled={pageNumber >= numPages}
                variant="outline"
                size="sm"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full flex flex-col items-center justify-center border border-dashed rounded-lg p-12 text-center">
          <Link className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No PDF selected</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Enter a PDF URL and click "View PDF" to load it.
          </p>
        </div>
      )}
    </div>
  );
}
