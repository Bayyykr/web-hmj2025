const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mysql = require("mysql");
const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(expressLayouts);

//aplication middleware
app.use(express.static("public"));

//db
const db = mysql.createConnection({
  host: "localhost",
  database: "hmj",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected");
});

const sql = `
    SELECT 
        kegiatan.*,
        TO_BASE64(gambar) as base64Image,
        DATE_FORMAT(tanggal, '%d %b') as formatted_date,
        YEAR(tanggal) as tahun
    FROM kegiatan
    WHERE tanggal >= CURDATE()
    ORDER BY tanggal ASC
`;

app.get("/", (req, res) => {
  db.query(sql, (err, result) => {
    if (err) throw err;

    // Process the results
    const events = result.map((item) => ({
      ...item,
      base64Image: item.base64Image ? `data:image/jpeg;base64,${item.base64Image}` : null,
      dateDisplay: `${item.formatted_date}\n${item.tahun}`,
    }));

    // Render the page with all required data
    res.render("index", {
      layout: "layouts/main-layout",
      css: "/css/style.css",
      js: "/js/script.js",
      events: events,
      title: "HMJ TI 2025",
    });
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman About",
    layout: "layouts/main-layout",
    css: "/css/about.css",
    js: "/js/script.js",
  });
});

app.get("/management", (req, res) => {
  res.render("management", {
    title: "Halaman management",
    layout: "layouts/main-layout",
    css: "/css/management.css",
    js: "/js/management.js",
  });
});

const artikelSql = `
    SELECT
        artikel.*,
        kategori.nama_kategori,
        TO_BASE64(picture) as base64Image
    FROM artikel
    JOIN kategori ON artikel.id_kategori = kategori.id_kategori
`;

app.get("/berita", (req, res) => {
  db.query(artikelSql, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error occurred");
    }

    const datas = result.map((item) => ({
      ...item,
      base64Image: item.base64Image ? `data:image/jpeg;base64,${item.base64Image}` : null,
    }));

    res.render("berita", {
      layout: "layouts/main-layout",
      css: "/css/berita.css",
      js: "/js/berita.js",
      datas: datas, // This is crucial - passing the data to the template
      title: "ARTIKEL",
      formatDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      },
    });
  });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    title: "Halaman contact",
    layout: "layouts/main-layout",
    css: "/css/contact.css",
    js: "/js/script.js",
    success: req.query.success, // Untuk menampilkan pesan sukses
    error: req.query.error, // Untuk menampilkan pesan error
  });
});

app.post("/submit-contact", (req, res) => {
  const { name, email, message } = req.body;

  // Validasi data tidak kosong
  if (!name || !email || !message) {
    return res.redirect("/contact?error=missing_fields");
  }

  // Validasi email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.redirect("/contact?error=invalid_email");
  }

  // Query untuk menyimpan ke database
  const sql = "INSERT INTO contacts (name, email, message, created_at) VALUES (?, ?, ?, NOW())";
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error("Error saving to database:", err);
      return res.redirect("/contact?error=db_error");
    }

    // Redirect dengan parameter success
    res.redirect("/contact?success=true");
  });
});

// const sql = `
//         SELECT
//             artikel.*,
//             kategori.nama_kategori,
//             TO_BASE64(picture) as base64Image
//         FROM artikel
//         JOIN kategori ON artikel.id_kategori = kategori.id_kategori
//     `

// app.get("/berita", (req, res) => {
//     db.query(sql, (err, result) => {
//         if (err) throw err
//         const datas = result.map(item => ({
//             ...item,
//             base64Image: item.base64Image ? `data:image/jpeg;base64,${item.base64Image}` : null
//         }))

//         res.render("berita", {
//             layout: 'layouts/main-layout',
//             css: '/css/berita.css',
//             js: '/js/berita.js',
//             datas: datas,
//             title: "ARTIKEL",
//             formatDate: (dateString) => {
//                 const date = new Date(dateString);
//                 return date.toLocaleDateString('en-GB', {
//                     day: 'numeric',
//                     month: 'short',
//                     year: 'numeric'
//                 });
//             }
//         })
//     })
// })

app.use((req, res) => {
  res.status(404);
  res.send("404");
});

app.listen(port, () => {
  console.log("berhasil connect");
});
