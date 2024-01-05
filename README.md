Selamat datang di repositori SimpleECommerceAPI! Repositori ini berisi kode sumber untuk aplikasi toko online sederhana yang dikembangkan menggunakan Express.js, Sequelize, JSON Web Tokens (JWT), Cloudinary, Multer, dan Swagger. Dengan aplikasi ini, Anda dapat membuat toko online dengan fitur registrasi, login, manajemen produk, keranjang belanja, dan lainnya.

Panduan Pengguna
1. Clone Repositori
> Lakukan git clone https://github.com/nameisjar/ads.git pada terminal

2. Instalasi Dependensi
> lakukan cd ads
> Kemudian npm install

3. Konfigurasi Database
> Buat file .env 
> Sesuaikan konfigurasi database Anda di file .env

4. Migrasi Database
> Lakukan npx sequelize-cli db:create jika nama databse belum ada
> Kemudian lakukan npx sequelize-cli db:migrate

5. Jalankan seeder
> Lakukan npx sequelize-cli db:seed:all untuk mengisi data ke database

Note: Jika ingin bisa upload image, maka gunakan kode dari masing-masing akun yang didapat dari cloudinary
