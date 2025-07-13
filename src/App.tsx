import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_PEMBERIAN_LAMPUNG } from "./graphql/queries";
import type { ModelPemberianInput, PemberianLampung } from "./types/gqlTypes";
import "./App.css";
import fotoPoster from './assets/foto.jpg';
import logoPKB from './assets/logo.svg';
//import logoPKB from './assets/logoPKB.svg';


function App() {
  const [formInput, setFormInput] = useState<ModelPemberianInput>({
    nisn: "",
    nik: ""
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  // const [searchAttempted, setSearchAttempted] = useState(false);

  const [getPemberianLampung, { loading, data }] = useLazyQuery<{
    getPemberianLampung: PemberianLampung;
  }>(GET_PEMBERIAN_LAMPUNG);

  const [isLoading, setIsLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(true); // buat fade out

  useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false); // sembunyikan splash content
    setTimeout(() => {
      setShowSplash(false); // hapus splash screen dari DOM setelah animasi selesai
    }, 500); // waktu fade-out cocokkan dengan CSS (0.5s)
  }, 2000);

  return () => clearTimeout(timer);
  }, []);
  
  const handleReset = () => {
    setFormInput({ nisn: "", nik: "" });
    setErrors([]); // Bersihkan error
    setHasSearched(false); // Supaya hasil pencarian hilang
  };

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

    if (!validateInput()) {
      setApiError(null); // bersihkan error API jika ada
      return;
    };

    setHasSearched(true);

    getPemberianLampung({
      variables: { input: formInput },
      onCompleted: (data) => {
        if (!data || !data.getPemberianLampung) {
          // window.alert("❌ Data tidak ditemukan. Pastikan NISN dan NIK sesuai.");
          setApiError("❌ Data tidak ditemukan. Pastikan NISN dan NIK sesuai.");
        }else {
          setApiError(null); // Bersihkan error jika data ditemukan
        }
      },
      onError: (error) => {
        console.error("GraphQL error:", error.message);
        // window.alert("❌ Data tidak ditemukan. Pastikan NISN dan NIK sesuai.");
        setApiError("❌ Data tidak ditemukan. Pastikan NISN dan NIK sesuai.");
      }
    });
  };


  // if (isLoading) {
  // return (
  //   <div className="splash-screen">
  //     <img src={logoPKB} alt="Loading Poster" className="splash-image" />
  //   </div>
  //   );
  // }

  if (showSplash) {
  return (
    <div className={`splash-screen ${!isLoading ? "fade-out" : ""}`}>
      <img src={logoPKB} alt="Logo PKB" className="splash-image" />
    </div>
    );
  }

  return (
    <div className="app-container">
      <div className="content-wrapper">
        <div className="poster-image">
          <img src={fotoPoster} alt="Poster" />
        </div>
        <div className="card">
          <h2>🔍 Cek Penerima PIP Aspirasi 2025 Dr. H. Muhammad Kadafi, S.H., M.H.</h2>
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
          {errors.length > 0 && (
            <div className="error-box">
              {errors.map((err, idx) => (
                <p key={idx}>⚠️ {err}</p>
              ))}
            </div>
          )}
          {apiError && (
            <div className="error-box">
              <p>⚠️ {apiError}</p>
            </div>
          )}
          {/* ✅ Hanya tampilkan hasil setelah pencarian */}
          {hasSearched && data?.getPemberianLampung && (
          data.getPemberianLampung.layakPIP === "1" ? (
            <div className="result-box">
              <h4>📄 Informasi Penerimaan PIP:</h4>
              <p><strong>Nama:</strong> {data.getPemberianLampung.nama}</p>
              <p><strong>Nama Sekolah:</strong> {data.getPemberianLampung.namaSekolah}</p>
              <p><strong>NIK:</strong> {data.getPemberianLampung.nik}</p>
              <p><strong>Nominal:</strong> {data.getPemberianLampung.nominal}</p>
              <p><strong>Nomor SK:</strong> {data.getPemberianLampung.nomorSK}</p>
              <p><strong>Bank:</strong> {data.getPemberianLampung.bank}</p>
              <p><strong>Rekening:</strong> {data.getPemberianLampung.rekening}</p>
              <p><strong>Rombel:</strong> {data.getPemberianLampung.rombel}</p>
              <p><strong>Tipe SK:</strong> {data.getPemberianLampung.tipeSK}</p>
              <p className="important-announcement">
                Selamat!
                Kamu terpilih sebagai penerima Bantuan PIP 2025 dari aspirasi Dr. Muhammad Kadafi, S.H., M.H. (Fraksi PKB).
                Dana sebesar <span>{data.getPemberianLampung.nominal}</span> bisa dicairkan mulai 3 Juli 2025 di Bank BRI atau ATM terdekat.
                Ingat! Program ini tidak dipungut biaya.
                Jika ada yang meminta bayaran, abaikan dan segera laporkan ya!
                Ke KDV Center
                Terima kasih, semoga bantuannya bermanfaat.
              </p>
            </div>
          ) : (
            <div className="result-box">
              <p className="failed-announcement">
                Mohon maaf Anda belum masuk SK PIP tahap pertama sesi 1. 
                Apabila sebelumnya telah mengusulkan dan dinyatakan lolos validasi dalam usulan, 
                Anda dapat berpeluang masuk SK PIP tahap pertama sesi 2 di bulan Juli 2025.
              </p>
            </div>
          )
        )}
        </div>
      </div>
    </div>
  );
}

export default App;