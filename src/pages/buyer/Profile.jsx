import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../service/api";
import Cropper from "react-easy-crop";
import "../../styles/profile.css";

const BASE_URL = "http://127.0.0.1:8000";

export default function Profile({ onUserUpdate }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* ===== FORM ===== */
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    password: "",
    password_confirmation: "",
  });

  /* ===== AVATAR ===== */
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  /* ===== NOTIFICATION ===== */
  const [notify, setNotify] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  });

  const showNotify = (message, type = "success") => {
    setNotify({ show: true, message, type });
    setTimeout(() => {
      setNotify({ show: false, message: "", type });
    }, 4000);
  };

  /* ===== CROP ===== */
  const [imageSrc, setImageSrc] = useState(null);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  /* ===== LOAD PROFILE ===== */
  useEffect(() => {
    api.get("/profile")
      .then((res) => {
        setUser(res.data);
        setProfileForm({ name: res.data.name, email: res.data.email });
        setPreview(
          res.data.avatar ? `${BASE_URL}/storage/${res.data.avatar}` : null
        );
        localStorage.setItem("user", JSON.stringify(res.data));
        onUserUpdate?.(res.data);
      })
      .catch(() => showNotify("Gagal memuat profil", "error"));
  }, [onUserUpdate]);

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "");

  /* ===== UPDATE PROFILE ===== */
  const updateProfile = () => {
    api.put("/profile", profileForm)
      .then((res) => {
        const updatedUser = { ...user, ...res.data.user };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        onUserUpdate?.(updatedUser);
        showNotify("Profil berhasil diperbarui");
      })
      .catch(() => showNotify("Gagal update profil", "error"));
  };

  const updatePassword = () => {
    api.put("/profile/password", passwordForm)
      .then(() => {
        setPasswordForm({
          old_password: "",
          password: "",
          password_confirmation: "",
        });
        showNotify("Password berhasil diperbarui");
      })
      .catch(() => showNotify("Gagal update password", "error"));
  };

  

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const createCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2,
      0,
      Math.PI * 2
    );
    ctx.clip();

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
      }, "image/jpeg");
    });
  };

  const saveCrop = async () => {
    const cropped = await createCroppedImage();
    if (!cropped) return;

    setAvatarFile(cropped);
    setPreview(URL.createObjectURL(cropped));
    setShowCrop(false);
  };

  /* ===== UPLOAD AVATAR ===== */
  const uploadAvatar = () => {
    if (!avatarFile) {
      showNotify("Pilih & crop foto terlebih dahulu", "error");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    api.post("/profile/avatar", formData)
  .then((res) => {
    const updatedUser = { ...user, avatar: res.data.avatar };

    setUser(updatedUser);
    setPreview(`${BASE_URL}/storage/${res.data.avatar}`);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // 🔥 KIRIM EVENT KE NAVBAR
    window.dispatchEvent(new Event("userUpdated"));

    onUserUpdate?.(updatedUser);
    showNotify("Foto profil berhasil diupload");
  })

      .catch(() => showNotify("Gagal upload foto", "error"));
  };

  const deleteAvatar = () => {
  api.delete("/profile/avatar").then(() => {
    const updatedUser = { ...user, avatar: null };

    setUser(updatedUser);
    setPreview(null);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    window.dispatchEvent(new Event("userUpdated"));

    onUserUpdate?.(updatedUser);
    showNotify("Foto profil berhasil dihapus");
  });
};

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.dispatchEvent(new Event("userUpdated"));

  showNotify("Berhasil logout");

  setTimeout(() => {
    navigate("/login");
  }, 800);
};


const EyeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
  >
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.94" />
    <path d="M1 1l22 22" />
    <path d="M9.53 9.53A3 3 0 0 0 12 15a3 3 0 0 0 2.47-4.47" />
  </svg>
);




  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-page">
      {notify.show && (
      <div className={`notify-top notify-${notify.type}`}>
        <span className="notify-icon">
          {notify.type === "success" ? "✔" : "✖"}
        </span>
        <span>{notify.message}</span>
      </div>
    )}

      <h2 className="profile-page-title">Profil Saya</h2>
      <p className="profile-page-desc">
        Kelola informasi profil Anda untuk mengontrol dan mengamankan akun
      </p>

      <div className="profile-container">
        {/* FORM */}
        <div className="profile-form">
          <h3>Informasi Profil</h3>

          <div className="form-group">
            <label>Nama</label>
            <input
              value={profileForm.name}
              onChange={(e) =>
                setProfileForm({ ...profileForm, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
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

          <input
            type="password"
            className="profile-input"
            placeholder="Password lama"
            value={passwordForm.old_password}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, old_password: e.target.value })
            }
          />

          <div className="password-wrapper">
  <input
    type={showNewPassword ? "text" : "password"}
    className="profile-input"
    placeholder="Password baru"
    value={passwordForm.password}
    onChange={(e) =>
      setPasswordForm({ ...passwordForm, password: e.target.value })
    }
  />

  <span
    className="toggle-password"
    onClick={() => setShowNewPassword(!showNewPassword)}
  >
    {showNewPassword ? EyeOffIcon : EyeIcon}
  </span>
</div>


          <div className="password-wrapper">
  <input
    type={showConfirmPassword ? "text" : "password"}
    className="profile-input"
    placeholder="Konfirmasi password"
    value={passwordForm.password_confirmation}
    onChange={(e) =>
      setPasswordForm({
        ...passwordForm,
        password_confirmation: e.target.value,
      })
    }
  />

  <span
    className="toggle-password"
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
  >
    {showConfirmPassword ? EyeOffIcon : EyeIcon}
  </span>
</div>


          <button className="btn-primary" onClick={updatePassword}>
            Ganti Password
          </button>
          <br /><br /><br />
          <button
    className="btn-danger btn-block logout-btn-profile"
    onClick={handleLogout}
  >
    Logout
  </button>


        </div>

        {/* AVATAR */}
        <div className="profile-avatar-box">
          {preview ? (
            <img src={preview} alt="Avatar" className="avatar-image" />
          ) : (
            <div className="avatar-placeholder">{getInitial(user.name)}</div>
          )}

          <input
            type="file"
            id="avatarInput"
            hidden
            accept="image/*"
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

      {/* CROP MODAL */}
      {showCrop && (
        <div className="crop-modal">
          <div className="crop-box">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />

            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />

            <div className="crop-actions">
              <button
                className="btn-danger"
                onClick={() => setShowCrop(false)}
              >
                Batal
              </button>
              <button className="btn-primary" onClick={saveCrop}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
