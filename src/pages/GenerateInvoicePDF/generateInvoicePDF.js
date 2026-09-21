import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function generateInvoicePDF(containerRef, fileName) {
  if (!containerRef?.current) return;

  const pages = Array.from(
    containerRef.current.querySelectorAll(".invoice-page")
  );

  if (!pages.length) return;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  for (let idx = 0; idx < pages.length; idx++) {
    const orig = pages[idx];

    // Clone into a fixed-size container for clean rendering
    const cont = document.createElement("div");
    cont.style.cssText =
      "position:fixed;left:0;top:0;width:210mm;height:297mm;background:#fff;z-index:9999;";

    const page = orig.cloneNode(true);
    page.style.cssText =
      "width:210mm;min-height:297mm;padding:0;background:#fff;";

    cont.appendChild(page);
    document.body.appendChild(cont);

    // Let fonts/images settle
    await new Promise((r) => setTimeout(r, 200));

    const canvas = await html2canvas(page, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fff",
    });

    cont.remove();

    if (idx > 0) pdf.addPage("a4", "portrait");

    pdf.addImage(
      canvas.toDataURL("image/jpeg", 0.98),
      "JPEG",
      0,
      0,
      210,
      297
    );
  }

  pdf.save(fileName || "invoice.pdf");
}