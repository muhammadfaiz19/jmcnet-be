import { PDFParse } from "pdf-parse";
import XLSX from "xlsx";

/**
 * Extract plain text content from a PDF file buffer.
 */
export async function parsePdf(buffer: Buffer): Promise<string> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text || "";
}


/**
 * Extract plain text content from an Excel file buffer.
 */
export function parseExcel(buffer: Buffer): string {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  let textContent = "";

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const sheetText = XLSX.utils.sheet_to_txt(worksheet);

    textContent += `--- Sheet: ${sheetName} ---\n`;
    textContent += sheetText + "\n\n";
  });

  return textContent.trim();
}

/**
 * Parse an uploaded file based on its mime type or extension.
 */
export async function parseFileContent(
  buffer: Buffer,
  mimeType: string,
  filename: string
): Promise<string> {
  const isExcel =
    mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    mimeType === "application/vnd.ms-excel" ||
    filename.endsWith(".xlsx") ||
    filename.endsWith(".xls");

  const isPdf = mimeType === "application/pdf" || filename.endsWith(".pdf");

  if (isPdf) {
    return await parsePdf(buffer);
  } else if (isExcel) {
    return parseExcel(buffer);
  } else {
    throw new Error("Unsupported file type. Only PDF and Excel are allowed.");
  }
}
