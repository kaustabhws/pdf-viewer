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
import { ChevronLeft, ChevronRight, Upload, X } from "lucide-react";

// Set up the PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer() {
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [fileName, setFileName] = useState<string>("");

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1); // Reset to first page on new file upload
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      setPdfFile(fileURL);
      setFileName(file.name);
    } else {
      alert("Please select a valid PDF file.");
    }
  }

  function clearFile() {
    setPdfFile(null);
    setFileName("");
    setNumPages(0);
  }

  function goToPrevPage() {
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  }

  function goToNextPage() {
    setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
  }

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-6 space-y-6">
      <div className="w-full">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="pdf-upload" className="text-base font-medium">
            Upload PDF
          </Label>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full flex justify-start text-left font-normal"
                onClick={() => document.getElementById("pdf-upload")?.click()}
              >
                <Upload className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {fileName ? fileName : "Choose file..."}
                </span>
              </Button>
              <Input
                id="pdf-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                className="sr-only"
              />
            </div>
            {fileName && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFile}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Clear</span>
              </Button>
            )}
          </div>
        </div>
      </div>

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
          <Upload className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No PDF selected</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Upload a PDF file to view its contents
          </p>
        </div>
      )}
    </div>
  );
}
