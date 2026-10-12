import { useEffect, useState } from "react";
import {
  BookOpen,
  Check,
  LoaderCircle,
  Mail,
  Pencil,
  Phone,
  Plus,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import api from "../../api";
import { useUser } from "../Navbar/context/userContext";
import { readingLessons } from "../../data/readingLessons";
import "./Profile.css";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

const Profile = () => {
  const { user, setUser } = useUser();
  const [name, setName] = useState(user?.username || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [skills, setSkills] = useState(user?.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || "");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [sendingEmailCode, setSendingEmailCode] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  useEffect(() => {
    setName(user?.username || "");
    setPhone(user?.phone || "");
    setSkills(user?.skills || []);
    setNewEmail(user?.email || "");
  }, [user]);

  useEffect(() => {
    document.title = "My Profile - SKCodingSchool";
  }, []);

  const savedLessons = new Set(user?.readingProgress || []);
  const completedLessons = readingLessons.filter((lesson) => savedLessons.has(lesson.id));
  const progressPercent = Math.round(
    (completedLessons.length / readingLessons.length) * 100
  );

  const saveUser = (updatedUser) => {
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleAddSkill = (event) => {
    event.preventDefault();
    const skill = skillInput.trim();
    if (!skill) return;
    if (skill.length > 40) {
      toast.error("Each skill must be 40 characters or fewer.");
      return;
    }
    if (skills.some((existingSkill) => existingSkill.toLowerCase() === skill.toLowerCase())) {
      setSkillInput("");
      return;
    }
    if (skills.length >= 20) {
      toast.error("You can add up to 20 skills.");
      return;
    }
    setSkills((currentSkills) => [...currentSkills, skill]);
    setSkillInput("");
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.patch(
        "/user/profile",
        { username: name, phone, skills },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      saveUser(data.user);
      toast.success(data.message);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save your profile."));
    } finally {
      setSaving(false);
    }
  };

  const handleRequestEmailCode = async (event) => {
    event.preventDefault();
    setSendingEmailCode(true);
    try {
      const { data } = await api.post(
        "/user/profile/email/request",
        { email: newEmail },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setEmailCodeSent(true);
      setEmailOtp("");
      toast.success(data.message);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not send the verification code."));
    } finally {
      setSendingEmailCode(false);
    }
  };

  const handleVerifyEmail = async (event) => {
    event.preventDefault();
    setVerifyingEmail(true);
    try {
      const { data } = await api.post(
        "/user/profile/email/verify",
        { otp: emailOtp },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      saveUser(data.user);
      setEmailCodeSent(false);
      setEmailOtp("");
      toast.success(data.message);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not verify the new email."));
    } finally {
      setVerifyingEmail(false);
    }
  };

  return (
    <main className="profile-page">
      <div className="profile-container">
        <header className="profile-heading">
          <div>
            <p className="profile-eyebrow">YOUR LEARNING SPACE</p>
            <h1>My Profile</h1>
            <p>Manage your account details and keep track of your learning.</p>
          </div>
        </header>

        <section className="profile-hero">
          <div className="profile-avatar" aria-hidden="true">
            {(user?.username || "S").trim().charAt(0).toUpperCase()}
          </div>
          <div className="profile-hero-copy">
            <span className="profile-label">STUDENT PROFILE</span>
            <h2>{user?.username || "Learner"}</h2>
            <p>{user?.email}</p>
          </div>
          <div className="profile-verified">
            <Check size={15} aria-hidden="true" />
            Verified account
          </div>
        </section>

        <section className="profile-progress-card" aria-labelledby="reading-progress-title">
          <div className="profile-section-icon progress-icon">
            <BookOpen size={21} aria-hidden="true" />
          </div>
          <div className="profile-progress-content">
            <div className="profile-progress-heading">
              <div>
                <h2 id="reading-progress-title">Reading progress</h2>
                <p>Lesson pages you’ve opened while signed in</p>
              </div>
              <strong>{progressPercent}%</strong>
            </div>
            <div
              className="profile-progress-track"
              role="progressbar"
              aria-label="Reading progress"
              aria-valuemin="0"
              aria-valuemax={readingLessons.length}
              aria-valuenow={completedLessons.length}
            >
              <span style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="profile-progress-footer">
              <span>{completedLessons.length} of {readingLessons.length} lessons visited</span>
              {completedLessons.length > 0 && (
                <span className="profile-progress-recent">
                  {completedLessons.slice(-2).map((lesson) => lesson.name).join(" · ")}
                </span>
              )}
            </div>
          </div>
        </section>

        <div className="profile-grid">
          <section className="profile-card">
            <div className="profile-card-heading">
              <div className="profile-section-icon">
                <UserRound size={20} aria-hidden="true" />
              </div>
              <div>
                <h2>Personal information</h2>
                <p>Keep your profile details up to date.</p>
              </div>
            </div>

            <form className="profile-form" onSubmit={handleSaveProfile}>
              <label className="profile-field">
                <span>Full name</span>
                <span className="profile-input-wrap">
                  <UserRound size={17} aria-hidden="true" />
                  <input
                    autoComplete="name"
                    maxLength={50}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your name"
                    required
                    value={name}
                  />
                </span>
              </label>

              <label className="profile-field">
                <span>Phone number</span>
                <span className="profile-input-wrap">
                  <Phone size={17} aria-hidden="true" />
                  <input
                    autoComplete="tel"
                    maxLength={25}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+91 70794 87202"
                    type="tel"
                    value={phone}
                  />
                </span>
              </label>

              <div className="profile-field">
                <span>Skills</span>
                <div className="profile-skill-entry">
                  <input
                    aria-label="Add a skill"
                    maxLength={40}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleAddSkill(event);
                    }}
                    placeholder="e.g. React, Python"
                    value={skillInput}
                  />
                  <button
                    aria-label="Add skill"
                    className="profile-add-skill"
                    disabled={!skillInput.trim() || skills.length >= 20}
                    onClick={handleAddSkill}
                    type="button"
                  >
                    <Plus size={18} aria-hidden="true" />
                    Add
                  </button>
                </div>
                <div className="profile-skill-list" aria-live="polite">
                  {skills.length ? skills.map((skill) => (
                    <span className="profile-skill-chip" key={skill}>
                      {skill}
                      <button
                        aria-label={`Remove ${skill}`}
                        onClick={() => setSkills((currentSkills) => (
                          currentSkills.filter((item) => item !== skill)
                        ))}
                        type="button"
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </span>
                  )) : <span className="profile-empty-skills">Add skills you’re learning or practicing.</span>}
                </div>
              </div>

              <button className="profile-primary-button" disabled={saving} type="submit">
                {saving ? <LoaderCircle className="profile-spinner" size={17} /> : <Pencil size={16} />}
                {saving ? "Saving…" : "Save profile"}
              </button>
            </form>
          </section>

          <section className="profile-card">
            <div className="profile-card-heading">
              <div className="profile-section-icon">
                <Mail size={20} aria-hidden="true" />
              </div>
              <div>
                <h2>Email address</h2>
                <p>Verify your new address before it becomes your login email.</p>
              </div>
            </div>

            {!emailCodeSent ? (
              <form className="profile-form" onSubmit={handleRequestEmailCode}>
                <label className="profile-field">
                  <span>New email address</span>
                  <span className="profile-input-wrap">
                    <Mail size={17} aria-hidden="true" />
                    <input
                      autoComplete="email"
                      onChange={(event) => setNewEmail(event.target.value)}
                      required
                      type="email"
                      value={newEmail}
                    />
                  </span>
                </label>
                <div className="profile-email-note">
                  A 6-digit code will be sent to the new email. Your current login address stays active until verification.
                </div>
                <button className="profile-primary-button" disabled={sendingEmailCode} type="submit">
                  {sendingEmailCode ? <LoaderCircle className="profile-spinner" size={17} /> : <Mail size={16} />}
                  {sendingEmailCode ? "Sending code…" : "Send verification code"}
                </button>
              </form>
            ) : (
              <form className="profile-form" onSubmit={handleVerifyEmail}>
                <div className="profile-email-note">
                  Enter the verification code sent to <strong>{newEmail}</strong>. It expires in 10 minutes.
                </div>
                <label className="profile-field">
                  <span>6-digit verification code</span>
                  <input
                    autoComplete="one-time-code"
                    className="profile-otp-input"
                    inputMode="numeric"
                    maxLength={6}
                    onChange={(event) => setEmailOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    pattern="\d{6}"
                    placeholder="000000"
                    required
                    value={emailOtp}
                  />
                </label>
                <button className="profile-primary-button" disabled={verifyingEmail || emailOtp.length !== 6} type="submit">
                  {verifyingEmail ? <LoaderCircle className="profile-spinner" size={17} /> : <Check size={17} />}
                  {verifyingEmail ? "Verifying…" : "Verify and update email"}
                </button>
                <button
                  className="profile-text-button"
                  onClick={() => {
                    setEmailCodeSent(false);
                    setEmailOtp("");
                  }}
                  type="button"
                >
                  Use a different email address
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Profile;
