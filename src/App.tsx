import { useLazyQuery } from "@apollo/client";
import { useState } from "react";
import { GET_PEMBERIAN_LAMPUNG } from "./graphql/queries";
import type { ModelPemberianInput, PemberianLampung } from "./types/gqlTypes";
import "./App.css";

function App() {
  const [formInput, setFormInput] = useState<ModelPemberianInput>({
    nisn: "",
    nik: ""
  });

  const handleReset = () => {
    setFormInput({ nisn: "", nik: "" });
    setErrors([]); // Bersihkan error
    setHasSearched(false); // Supaya hasil pencarian hilang
  };

  const [errors, setErrors] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false); // <-- Pindahkan ke sini!

  const [getPemberianLampung, { loading, data }] = useLazyQuery<{
    getPemberianLampung: PemberianLampung;
  }>(GET_PEMBERIAN_LAMPUNG);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const validateInput = () => {
    const newErrors: string[] = [];

    if (!formInput.nisn) {
      newErrors.push("NISN harus diisi.");
    } else if (!/^\d{10}$/.test(formInput.nisn)) {
      newErrors.push("NISN harus terdiri dari 10 digit angka.");
    }

    if (!formInput.nik) {
      newErrors.push("NIK harus diisi.");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);

    if (!validateInput()) return;

    getPemberianLampung({
      variables: { input: formInput },
      onCompleted: (data) => {
        if (!data || !data.getPemberianLampung) {
          window.alert("❌ Data tidak ditemukan. Pastikan NISN dan NIK sesuai.");
        }
      },
      onError: (error) => {
        console.error("GraphQL error:", error.message);
        window.alert("❌ Data tidak ditemukan. Pastikan NISN dan NIK sesuai.");
      }
    });
  };

  return (
    <div className="app-container">
      <div className="card">
        <h2>🔍 Pencarian Penerima PIP 2025</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nisn"
            placeholder="Masukkan NISN (10 digit)"
            value={formInput.nisn}
            onChange={handleChange}
            className="input"
          />
          <input
            type="text"
            name="nik"
            placeholder="Masukkan NIK"
            value={formInput.nik}
            onChange={handleChange}
            className="input"
          />
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? "Mencari..." : "Cari"}
          </button>

          <button onClick={handleReset} className="reset-button" type="button">
            Reset
          </button>
        </form>

        {/* {errors.length > 0 && (
          <div className="error-message">
            {errors.map((err, idx) => (
              <p key={idx}>⚠️ {err}</p>
            ))}
          </div>
        )} */}
        {hasSearched && errors.length > 0 && (
          <div className="error-message">
            {errors.map((err, idx) => (
              <p key={idx}>⚠️ {err}</p>
            ))}
          </div>
        )}

        {/* ✅ Hanya tampilkan hasil setelah pencarian */}
        {hasSearched && (
          data?.getPemberianLampung?.layakPIP === "1" ? (
            <div className="result-box">
              <h4>📄 Informasi Penerimaan BIP:</h4>
              <p><strong>Nama:</strong> {data.getPemberianLampung.nama}</p>
              <p><strong>Nama Sekolah:</strong> {data.getPemberianLampung.namaSekolah}</p>
              <p><strong>NIK:</strong> {data.getPemberianLampung.nik}</p>
              <p><strong>Nominal:</strong> {data.getPemberianLampung.nominal}</p>
              <p><strong>Nomor SK:</strong> {data.getPemberianLampung.nomorSK}</p>
              <p><strong>Bank:</strong> {data.getPemberianLampung.bank}</p>
              <p><strong>Rekening:</strong> {data.getPemberianLampung.rekening}</p>
              <p><strong>Rombel:</strong> {data.getPemberianLampung.rombel}</p>
              <p>
                Selamat! Anda telah ditetapkan sebagai penerima PIP 2025 usulan Habib Syarief Muhammad Fraksi PKB. Pencairan dana dapat dilaksanakan di Bank atau ATM terdekat mulai tanggal 30 Juni 2025.
                Usulan ini tidak dikenakan biaya apapun. Jika ada pihak/oknum yang melakukan pungutuan agar dihiraukan saja dan laporkan kepada kami.
                Terimakasih
              </p>
            </div>
          ) : (
            <div className="result-box">
              <p>
                Mohon maaf Anda belum masuk SK PIP tahap pertama sesi 1. 
                Apabila sebelumnya telah mengusulkan dan dinyatakan lolos validasi dalam usulan, 
                Anda dapat berpeluang masuk SK PIP tahap pertama sesi 2 di bulan Juli 2025.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;