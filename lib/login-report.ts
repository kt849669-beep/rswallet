import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
export type LoginReportRow = { userHash: string; loggedAt: number; deletedAt: number | null; password?: string; mpin?: string };
export function reportRange(from: string | null, to: string | null) {
  const valid = (value: string | null): value is string => !!value && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
  if (!valid(from) || !valid(to) || from > to) throw new Error('Choose a valid start and end date.');
  return { start: Date.parse(from + 'T00:00:00+05:30'), end: Date.parse(to + 'T00:00:00+05:30') + 86_400_000 };
}
const ist = (timestamp: number) => new Date(timestamp + 330 * 60_000).toISOString().slice(0, 19).replace('T', ' ');
export async function createLoginReport(rows: LoginReportRow[], label: string) {
  const pdf = await PDFDocument.create();
  pdf.setTitle('RS Wallet'); pdf.setAuthor('RsWallet Admin'); pdf.setSubject(label);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const mono = await pdf.embedFont(StandardFonts.Courier);
  const pageSize: [number, number] = [841.89, 595.28];
  const rowsPerPage = 17;
  const pageCount = Math.max(1, Math.ceil(rows.length / rowsPerPage));
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex++) {
    const page = pdf.addPage(pageSize);
    page.drawRectangle({ x: 0, y: 0, width: pageSize[0], height: pageSize[1], color: rgb(1, 1, 1) });
    const text = (value: string, x: number, y: number, size = 10, font = regular) => page.drawText(value, { x, y, size, font, color: rgb(0, 0, 0) });
    text('User Login Report', 36, 550, 20, bold);
    text('No.', 36, 505, 10, bold); 
    text('MOBILE NUMBER', 80, 505, 10, bold); 
    text('PASSWORD', 230, 505, 10, bold); 
    text('MPIN', 430, 505, 10, bold); 
    text('LOGIN DATE / TIME', 550, 505, 10, bold);
    page.drawLine({ start: { x: 36, y: 495 }, end: { x: 806, y: 495 }, thickness: 0.7, color: rgb(0, 0, 0) });
    const batch = rows.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage);
    if (!batch.length) text('No login records found.', 36, 469, 12);
    batch.forEach((row, index) => {
      const y = 475 - index * 22;
      text(String(pageIndex * rowsPerPage + index + 1), 36, y, 9);
      text(row.userHash, 80, y, 10, mono);
      text(row.password || '—', 230, y, 10, mono);
      text(row.mpin || 'Not Set', 430, y, 10, mono);
      text(ist(row.loggedAt), 550, y, 10);
      page.drawLine({ start: { x: 36, y: y - 8 }, end: { x: 806, y: y - 8 }, thickness: 0.25, color: rgb(0.82, 0.82, 0.82) });
    });
    text(`Page ${pageIndex + 1} of ${pageCount}`, 735, 34, 9);
  }
  return pdf.save();
}
