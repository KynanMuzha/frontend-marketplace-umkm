import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/profile.css";

const API_URL = "http://localhost:8000";

export default function Profile({ onUserUpdate }) {
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  /* ======================
     AMBIL DATA PROFIL
  ====================== */
  useEffect(() => {
    if (!token) return;

    axios
      .get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setProfileForm({
          name: res.data.name,
          email: res.data.email,
        });
        setPreview(res.data.avatar || null);

        localStorage.setItem("user", JSON.stringify(res.data));
        onUserUpdate?.(res.data);
      })
      .catch(console.error);
  }, []);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

  /* ======================
     UPDATE PROFIL
  ====================== */
  const updateProfile = () => {
    axios
      .put(`${API_URL}/api/profile`, profileForm, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const updatedUser = { ...user, ...res.data.user };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        onUserUpdate?.(updatedUser);
        alert("Profil berhasil diperbarui");
      })
      .catch((err) =>
        alert(err.response?.data?.message || "Gagal update profil")
      );
  };

  /* ======================
     UPDATE PASSWORD
  ====================== */
  const updatePassword = () => {
    axios
      .put(`${API_URL}/api/profile/password`, passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setPasswordForm({
          old_password: "",
          password: "",
          password_confirmation: "",
        });
        alert("Password berhasil diperbarui");
      })
      .catch((err) =>
        alert(err.response?.data?.message || "Gagal update password")
      );
  };

  /* ======================
     AVATAR
  ====================== */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadAvatar = () => {
    if (!avatarFile) return alert("Pilih foto terlebih dahulu");

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    axios
      .post(`${API_URL}/api/profile/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const updatedUser = { ...user, avatar: res.data.avatar };
        setUser(updatedUser);
        setPreview(res.data.avatar);
        setAvatarFile(null);

        localStorage.setItem("user", JSON.stringify(updatedUser));
        onUserUpdate?.(updatedUser);

        alert("Foto profil berhasil diupload");
      })
      .catch((err) =>
        alert(err.response?.data?.message || "Gagal upload foto")
      );
  };

  const deleteAvatar = () => {
    axios
      .delete(`${API_URL}/api/profile/avatar`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        const updatedUser = { ...user, avatar: null };
        setUser(updatedUser);
        setPreview(null);

        localStorage.setItem("user", JSON.stringify(updatedUser));
        onUserUpdate?.(updatedUser);

        alert("Foto profil berhasil dihapus");
      })
      .catch((err) =>
        alert(err.response?.data?.message || "Gagal hapus foto")
      );
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-page">
      {/* ===== TITLE ===== */}
      <h2 className="profile-page-title">Profil Saya</h2>
      <p className="profile-page-desc">
        Kelola informasi profil Anda untuk mengontrol dan mengamankan akun
      </p>

      <div className="profile-container">
        {/* ===== FORM KIRI ===== */}
        <div className="profile-form">
          <h3>Informasi Profil</h3>

          <div className="form-group">
            <label>Nama</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) =>
                setProfileForm({ ...profileForm, email: e.target.value })
              }
            />
          </div>

          <button className="btn-primary" onClick={updateProfile}>
            Simpan Profil
          </button>

          <h3 className="section-divider">Ubah Password</h3>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password lama"
              value={passwordForm.old_password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  old_password: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password baru"
              value={passwordForm.password}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  password: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Konfirmasi password"
              value={passwordForm.password_confirmation}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  password_confirmation: e.target.value,
                })
              }
            />
          </div>

          <button className="btn-primary" onClick={updatePassword}>
            Ganti Password
          </button>
        </div>

        {/* ===== AVATAR KANAN ===== */}
        <div className="profile-avatar-box">
          {preview ? (
            <img src={preview} alt="Avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">
              {getInitial(user.name)}
            </div>
          )}

          <input
            type="file"
            id="avatarInput"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          <label htmlFor="avatarInput" className="btn-outline">
            Pilih Foto
          </label>

          <div className="avatar-actions">
            <button className="btn-outline" onClick={uploadAvatar}>
              Upload Foto
            </button>

            {user.avatar && (
              <button className="btn-danger" onClick={deleteAvatar}>
                Hapus Foto
              </button>
            )}
          </div>

          <p className="avatar-note">Maks 2MB • JPG / PNG</p>
        </div>
      </div>
    </div>
  );
}
