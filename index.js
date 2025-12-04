import express from "express";
import { PDFParse } from 'pdf-parse';
import bodyParser from "body-parser";
// const { PDFParse } = 'pdf-parse';
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));

app.post("/extractPdfFromBase64", async (req, res) => {
  try {
    const { base64 } = req.body;

    if (!base64) {
      return res.status(400).json({ success: false, message: "No base64 PDF data provided" });
    }

    const pdfBuffer = Buffer.from(base64, "base64");
    const parser = new PDFParse({ data: pdfBuffer });
    const data = await parser.getText();
    await parser.destroy(); 

    return res.status(200).json({
      success: true,
      text: data.text,
    });
  } catch (error) {
    console.error("Error extracting PDF text from base64:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to extract PDF text from base64",
      error: error.message,
    });
  }
});
app.get("/", (req, res) => res.send("PDF Extract API is running"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import { PDFParse } from "pdf-parse"; // use the standard import

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(bodyParser.json({ limit: "50mb" }));

// app.post("/extractPdfFromBase64", async (req, res) => {
//   try {
//     const { base64 } = req.body;
//     if (!base64) {
//       return res
//         .status(400)
//         .json({ success: false, message: "No base64 PDF data provided" });
//     }

//     const pdfBuffer = Buffer.from(base64, "base64");
//     const parser = new PDFParse({ data: pdfBuffer });

//     const result = await parser.getText(); // extract text
//     await parser.destroy(); // free memory

//     return res.status(200).json({ success: true, text: result.text });
//   } catch (error) {
//     console.error("Error extracting PDF text:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: error.message });
//   }
// });

// app.get("/", (req, res) => res.send("PDF Extract API is running"));

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
