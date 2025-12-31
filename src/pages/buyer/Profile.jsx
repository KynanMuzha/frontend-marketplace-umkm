import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/profile.css";

export default function Profile({ onUserUpdate }) {
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Helper untuk membentuk URL avatar lengkap
  const getAvatarURL = (avatar) => {
    if (!avatar) return null;
    return avatar.startsWith("http") ? avatar : `http://localhost:8000/storage/avatars/${avatar}`;
  };

  // Ambil data profil saat mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://localhost:8000/api/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const data = res.data;
      const avatarURL = getAvatarURL(data.avatar);
      const updatedUser = { ...data, avatar: avatarURL };

      setUser(updatedUser);
      setProfileForm({ name: data.name, email: data.email });
      setPreview(avatarURL);

      // Pastikan localStorage selalu update
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (onUserUpdate) onUserUpdate(updatedUser);
    })
    .catch(err => console.error(err));
  }, []);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

  const handleProfileChange = (e) => setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file)); // preview sementara sebelum upload
  };

  const updateProfile = () => {
    const token = localStorage.getItem("token");
    axios.put("http://localhost:8000/api/profile", profileForm, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const updatedUser = { ...res.data, avatar: user.avatar };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (onUserUpdate) onUserUpdate(updatedUser);
      alert("Profil berhasil diperbarui");
    })
    .catch(err => alert(err.response?.data?.message || "Gagal update profil"));
  };

  const updatePassword = () => {
    const token = localStorage.getItem("token");
    if (passwordForm.new !== passwordForm.confirm) return alert("Password baru tidak sama");

    axios.put("http://localhost:8000/api/profile/password", passwordForm, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setPasswordForm({ current: "", new: "", confirm: "" });
      alert("Password berhasil diperbarui");
    })
    .catch(err => alert(err.response?.data?.message || "Gagal update password"));
  };

  const uploadAvatar = () => {
    if (!avatarFile) return alert("Pilih avatar terlebih dahulu!");
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", avatarFile);

    axios.post("http://localhost:8000/api/profile/avatar", formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    })
    .then(res => {
      const avatarURL = getAvatarURL(res.data.avatar);
      const updatedUser = { ...user, avatar: avatarURL };

      setUser(updatedUser);
      setPreview(avatarURL);
      setAvatarFile(null);

      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (onUserUpdate) onUserUpdate(updatedUser);

      alert("Avatar berhasil diupload");
    })
    .catch(err => alert(err.response?.data?.message || "Gagal upload avatar"));
  };

  const deleteAvatar = () => {
    const token = localStorage.getItem("token");
    axios.delete("http://localhost:8000/api/profile/avatar", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      const updatedUser = { ...user, avatar: null };
      setUser(updatedUser);
      setPreview(null);

      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (onUserUpdate) onUserUpdate(updatedUser);

      alert("Avatar berhasil dihapus");
    })
    .catch(err => alert(err.response?.data?.message || "Gagal hapus avatar"));
  };

  if (!user) return <div className="profile-page">Loading...</div>;

  return (
    <div className="profile-page">
      <h2 className="title">Profil Saya</h2>

      <div className="profile-avatar-section">
        {preview ? (
          <img src={preview} alt="Avatar" className="profile-avatar" />
        ) : (
          <div className="profile-initial">{getInitial(user.name)}</div>
        )}

        <input type="file" accept="image/*" onChange={handleAvatarChange} />
        <div className="avatar-buttons">
          <button onClick={uploadAvatar}>Upload Avatar</button>
          <button onClick={deleteAvatar} className="delete-btn">Hapus Avatar</button>
        </div>
      </div>

      <div className="forms-container">
        <div className="card">
          <h3>Update Profil</h3>
          <label>Nama</label>
          <input name="name" type="text" value={profileForm.name} onChange={handleProfileChange} />
          <label>Email</label>
          <input name="email" type="email" value={profileForm.email} onChange={handleProfileChange} />
          <button onClick={updateProfile}>Simpan Perubahan</button>
        </div>

        <div className="card">
          <h3>Update Password</h3>
          <label>Password Saat Ini</label>
          <input type="password" name="current" value={passwordForm.current} onChange={handlePasswordChange} />
          <label>Password Baru</label>
          <input type="password" name="new" value={passwordForm.new} onChange={handlePasswordChange} />
          <label>Konfirmasi Password Baru</label>
          <input type="password" name="confirm" value={passwordForm.confirm} onChange={handlePasswordChange} />
          <button onClick={updatePassword}>Ganti Password</button>
        </div>
      </div>
    </div>
  );
}
