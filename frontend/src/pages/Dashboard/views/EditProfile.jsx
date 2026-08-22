import SidebarLayout from "../../../layouts/SidebarLayout";
import { useSidebar } from "../../../context/SidebarContext";
import { Menu, Camera , Trash2} from "../../../icons/icons.jsx";
import Button from "../../../components/Button";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "../../../context/ProfileContext";
function EditProfile() {
  const { setDrawerOpen } = useSidebar();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please select a JPG or PNG image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be smaller than 2MB.");
      return;
    }

    setError("");
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const handleRemoveImage = () => {
  setSelectedImage(null);
  setImagePreview(null);

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = formData.username.trim();

    if (!username) {
      setError("Username is required.");
      return;
    }

    setError("");
    setSaving(true);

    try {
      await updateProfile({
        ...formData,
        username,
      });

      navigate("/profile");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <SidebarLayout />
      <main className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20  ">
          <div className="relative bg-background md:pt-4 pt-3 pb-3 px-8 flex justify-between items-center backdrop-blur-md w-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setDrawerOpen(true)}
                className="outline-none hover:bg-primary-light p-3 transition-all duration-150 rounded-full block md:hidden"
              >
                <Menu size={22} className="text-text" />
              </button>

              <h1 className="text-text text-2xl font-semibold">Edit Profile</h1>
            </div>
          </div>

          <div className="h-8 w-full bg-gradient-to-b from-background to-transparent pointer-events-none" />
        </header>

        <article className="px-5 rounded-3xl py-6 md:py-8 border-text-muted/30 border bg-surface mx-4 mb-4">
          <div>
            <h2 className="text-text text-lg font-semibold">Edit Profile</h2>
            <p className="text-text-muted text-sm">
              Upload your profile information and prefenreces.
            </p>
          </div>
           {error && (
            <div className="mt-5 rounded-lg bg-delete-bgLight px-4 py-3">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-9">
            <div className=" border rounded-xl border-text-muted/30 flex flex-col items-center justify-start py-4 px-4">
              <h3 className="text-text font-semibold">Profile Picture</h3>
           <div className="relative w-20 h-20 my-5">
  <div className="w-20 h-20 rounded-full overflow-hidden border bg-primary flex items-center justify-center">
    {imagePreview || profile?.avatarUrl ? (
      <img
        src={imagePreview || profile.avatarUrl}
        alt="Profile"
        className="w-full h-full object-cover"
      />
    ) : (
      <p className="text-surface text-3xl">
        {profile?.username?.charAt(0)?.toUpperCase() || "U"}
      </p>
    )}
  </div>

  <button
    aria-label="Change profile picture"
    type="button"
    onClick={() => fileInputRef.current?.click()}
    className="w-8 h-8 flex items-center justify-center rounded-full bg-surface border border-text-muted/30 absolute bottom-0 -right-3"
  >
    <Camera
      size={18}
      strokeWidth={1.5}
      className="text-text-muted"
    />
  </button>
</div>
                <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-xs text-text-muted">
                JPG or PNG. Max size 2MB
              </p>
              {/* <Button  type="button"
                onClick={() => fileInputRef.current?.click()} className="bg-primary-lighter mt-3 hover:bg-primary hover:text-surface transition-all duration-150">
                Change photo
              </Button> */}
                {(imagePreview || profile?.avatarUrl) && (
    <Button
      type="button"
      onClick={handleRemoveImage}
      className="bg-delete-bgLight text-error hover:bg-error hover:text-surface transition-all duration-150 my-4 flex gap-2"
    >
      Remove<Trash2 size={18} strokeWidth={2}/>
    </Button>
  )}
            </div>

            <div>
              <div className=" border rounded-xl border-text-muted/30 py-4 px-4">
                <form onSubmit={handleSubmit} className="w-full">
                   <div className="mb-2">
                    <label htmlFor="email" className="text-text text-xs">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                     value={profile?.email || ""}
                        disabled
                      className="w-full border rounded-lg px-3 py-2 border-text-muted/40 bg-surface placeholder:text-text-muted text-text-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-text-muted mt-1">
  Your registered email cannot be changed.
</p>
                  </div>
                  <div className="mb-2">
                    <label htmlFor="userName" className="text-text text-xs">
                      User Name
                    </label>
                    <input
                      id="userName"
                      type="text"
                      name="username"
                       value={formData.username}
                      onChange={handleChange}
                      className=" text-text w-full border border-text-muted/40 rounded-lg px-3 py-2 bg-surface placeholder:text-text-muted"
                    />
                  </div>
                 
                  <div className="bio">
                    <label htmlFor="bio" className="text-text text-xs">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us a little about yourself..."
                      className="w-full border rounded-lg px-3 py-2 border-text-muted/40 bg-surface text-text placeholder:text-text-muted resize-none"
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    {/* <Button
                      type="button"
                         onClick={() => navigate("/profile")}
                      className=" w-full bg-primary-light text-text hover:bg-primary-lighter"
                    >
                      Cancel
                    </Button> */}
                    <Button
                      type="submit"
                         disabled={saving}
                      className="w-full bg-primary text-surface hover:bg-primary-light hover:text-primary transition-all duration-150"
                    >
                       {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}

export default EditProfile;
