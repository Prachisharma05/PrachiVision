"use client";

import { FormEvent, useCallback, useId, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, ChevronRight, Download, ExternalLink, FileText, ImagePlus, LogOut, Menu, Play, Plus, Save, Settings, Trash2, Upload, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { parsePortfolio } from "@/lib/schema";
import { defaultContent } from "@/lib/default-content";
import { createSupabaseClient } from "@/lib/supabase";
import type { CaseStudySection, CollectionName, ContentItem, LinkItem, MediaItem, PortfolioContent, SkillGroup } from "@/lib/types";

const uid = (prefix = "item") => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const cloneDefault = () => JSON.parse(JSON.stringify(defaultContent)) as PortfolioContent;
const collections: Array<[CollectionName, string]> = [["projects", "Projects"], ["papers", "Papers"], ["certificates", "Certificates"], ["events", "Events"], ["education", "Education"], ["experience", "Experience"], ["updates", "Updates"]];
const nav = [["overview", "Overview"], ["profile", "Profile & resume"], ["about", "About"], ["skills", "Skills"], ...collections, ["club", "Club"], ["settings", "Site settings"]] as const;

type Tab = typeof nav[number][0];

export function AdminApp() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const loadedUser = useRef<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [content, setContent] = useState<PortfolioContent>(cloneDefault);
  const [tab, setTab] = useState<Tab>("overview");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const loadContent = useCallback(async () => {
    if (!supabase) { setLoading(false); return; }
    setLoading(true); setLoadFailed(false);
    try {
      const { data: membership, error: membershipError } = await supabase.from("admin_users").select("user_id").maybeSingle();
      if (membershipError || !membership) { setAuthorized(false); setNotice("This account is not the approved administrator. Check the admin_users entry."); return; }
      setAuthorized(true);
      const { data, error } = await supabase.from("portfolio_content").select("data").eq("id", "main").maybeSingle();
      if (error) throw error;
      setContent(data?.data ? parsePortfolio(data.data) : cloneDefault());
    } catch (error) { setLoadFailed(true); setNotice(error instanceof Error ? error.message : "Could not load saved content. Reload before editing."); }
    finally { setLoading(false); }
  }, [supabase]);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { setUser(session?.user || null); if (session?.user && loadedUser.current !== session.user.id) { loadedUser.current = session.user.id; void loadContent(); } else if (!session?.user) { loadedUser.current = null; setAuthorized(false); setLoading(false); } });
    return () => listener.subscription.unsubscribe();
  }, [supabase, loadContent]);

  async function save() {
    if (!supabase || !user || !authorized || loadFailed) return;
    setSaving(true); setNotice("");
    try {
      const validated = parsePortfolio(content);
      const { error } = await supabase.from("portfolio_content").upsert({ id: "main", data: validated, updated_at: new Date().toISOString() });
      if (error) throw error;
      setContent(validated); setNotice("All changes are published.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Unable to save. Please try again."); }
    finally { setSaving(false); }
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `prachivision-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
  }

  async function importBackup(file: File) {
    try { setContent(parsePortfolio(JSON.parse(await file.text()))); setNotice("Backup imported. Review it, then select Save & publish."); }
    catch (error) { setNotice(error instanceof Error ? error.message : "That file is not a valid portfolio backup."); }
  }

  if (loading) return <div className="admin-loading">Loading portfolio studio…</div>;
  if (!supabase) return <AdminSetup />;
  if (!user) return <AdminLogin />;
  if (!authorized || loadFailed) return <main className="admin-auth"><div className="admin-login"><h1>{loadFailed ? "Content unavailable" : "Admin access required"}</h1><p role="alert">{notice}</p><button className="button" onClick={() => void loadContent()}>Retry</button><button className="button secondary" onClick={() => void supabase.auth.signOut()}>Sign out</button></div></main>;

  return <div className="admin-shell">
    <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
      <div className="admin-brand"><span>PS</span><div><strong>Portfolio Studio</strong><small>Content management</small></div><button onClick={() => setMenuOpen(false)}><X /></button></div>
      <nav>{nav.map(([value, label]) => <button key={value} className={tab === value ? "active" : ""} onClick={() => { setTab(value); setMenuOpen(false); }}><span>{label}</span><ChevronRight size={15} /></button>)}</nav>
      <div className="admin-side-bottom"><a href="/" target="_blank">View portfolio <ExternalLink size={15} /></a><button onClick={() => supabase.auth.signOut()}>Sign out <LogOut size={15} /></button></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><button className="admin-menu" onClick={() => setMenuOpen(true)}><Menu /></button><div><span className="eyebrow">ADMIN</span><h1>{nav.find(([value]) => value === tab)?.[1]}</h1></div><div className="admin-top-actions"><button className="button secondary small" onClick={exportBackup}><Download size={15} /> Export</button><label className="button secondary small file-button"><Upload size={15} /> Import<input type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && importBackup(event.target.files[0])} /></label><button className="button small" onClick={save} disabled={saving || !authorized || loadFailed}><Save size={15} />{saving ? "Saving…" : "Save & publish"}</button></div></header>
      {notice ? <div className={`admin-notice ${notice.includes("published") ? "success" : ""}`}><span>{notice}</span><button onClick={() => setNotice("")}><X size={16} /></button></div> : null}
      <div className="admin-workspace">
        {tab === "overview" ? <Overview content={content} setTab={setTab} /> : null}
        {tab === "profile" ? <ProfileEditor content={content} setContent={setContent} supabase={supabase} setNotice={setNotice} /> : null}
        {tab === "about" ? <AboutEditor content={content} setContent={setContent} /> : null}
        {tab === "skills" ? <SkillsEditor content={content} setContent={setContent} /> : null}
        {collections.some(([value]) => value === tab) ? <CollectionEditor key={tab} name={tab as CollectionName} content={content} setContent={setContent} supabase={supabase} setNotice={setNotice} /> : null}
        {tab === "club" ? <ClubEditor content={content} setContent={setContent} supabase={supabase} setNotice={setNotice} /> : null}
        {tab === "settings" ? <SettingsEditor content={content} setContent={setContent} /> : null}
      </div>
    </main>
  </div>;
}

function AdminLogin() {
  const supabase = useMemo(() => createSupabaseClient(), []);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  async function login(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setError(""); const form = new FormData(event.currentTarget); try { const { error } = await supabase!.auth.signInWithPassword({ email: String(form.get("email")), password: String(form.get("password")) }); if (error) setError(error.message); } catch { setError("Unable to reach the sign-in service. Try again."); } finally { setBusy(false); } }
  return <main className="admin-auth"><form className="admin-login" onSubmit={login}><span className="brand-mark">PS</span><span className="eyebrow">PRIVATE ADMIN</span><h1>Portfolio Studio</h1><p>Sign in with the approved administrator account. Public sign-up is disabled.</p><div className="field"><label htmlFor="admin-email">Email</label><input className="input" id="admin-email" name="email" type="email" required autoComplete="username" /></div><div className="field"><label htmlFor="admin-password">Password</label><input className="input" id="admin-password" name="password" type="password" required autoComplete="current-password" /></div>{error ? <p className="admin-error">{error}</p> : null}<button className="button" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button><a href="/">← Back to portfolio</a></form></main>;
}

function AdminSetup() { return <main className="admin-auth"><div className="admin-login"><span className="brand-mark">PS</span><span className="eyebrow">SETUP REQUIRED</span><h1>Connect Supabase</h1><p>The portfolio itself is running on the initial portfolio content. To enable secure login, editing, and uploads, add the two public Supabase values from <code>.env.example</code>, run the included migration, and create the approved admin account.</p><a className="button" href="/">View portfolio</a></div></main>; }

function Overview({ content, setTab }: { content: PortfolioContent; setTab: (tab: Tab) => void }) {
  const stats = [[content.projects.length, "Projects", "projects"], [content.papers.length, "Papers", "papers"], [content.certificates.length, "Certificates", "certificates"], [content.events.length, "Events", "events"], [content.updates.length, "Updates", "updates"]] as const;
  return <><div className="admin-stat-grid">{stats.map(([count, label, target]) => <button key={label} onClick={() => setTab(target)}><strong>{String(count).padStart(2, "0")}</strong><span>{label}</span><ChevronRight /></button>)}</div><div className="admin-panel"><span className="eyebrow">QUICK START</span><h2>Your portfolio, in your words.</h2><p>Edit personal details, add new work, upload supporting media, publish achievements, replace the resume, or temporarily hide incomplete entries. Edits stay on this screen until you select <strong>Save & publish</strong>.</p><div className="admin-checklist"><span><Check /> Use clear titles and short summaries</span><span><Check /> Add alt text to every image</span><span><Check /> Publish only verified claims</span><span><Check /> Export a backup after major updates</span></div></div></>;
}

function ProfileEditor({ content, setContent, supabase, setNotice }: EditorProps & { supabase: NonNullable<ReturnType<typeof createSupabaseClient>>; setNotice: (value: string) => void }) {
  const profile = content.profile;
  const set = (key: keyof typeof profile, value: unknown) => setContent({ ...content, profile: { ...profile, [key]: value } });
  return <div className="admin-stack"><div className="admin-form-card"><h2>Public identity</h2><div className="form-grid">
    <Field label="Full name" value={profile.name} onChange={(v) => set("name", v)} /><Field label="Short name" value={profile.shortName} onChange={(v) => set("shortName", v)} />
    <Field label="Professional role" value={profile.role} onChange={(v) => set("role", v)} full /><Field label="Hero eyebrow" value={profile.eyebrow} onChange={(v) => set("eyebrow", v)} full />
    <Field label="Hero headline" value={profile.heroTitle} onChange={(v) => set("heroTitle", v)} textarea full /><Field label="Introduction" value={profile.introduction} onChange={(v) => set("introduction", v)} textarea full />
    <Field label="Location" value={profile.location} onChange={(v) => set("location", v)} /><Field label="Email" value={profile.email} onChange={(v) => set("email", v)} />
    <Field label="Logo URL" value={profile.logoUrl || ""} onChange={(v) => set("logoUrl", v)} /><Field label="Profile photo URL" value={profile.avatarUrl} onChange={(v) => set("avatarUrl", v)} /><Field label="Résumé URL" value={profile.resumeUrl} onChange={(v) => set("resumeUrl", v)} /><Field label="Phone" value={profile.phone} onChange={(v) => set("phone", v)} /><Field label="Availability" value={profile.availability} onChange={(v) => set("availability", v)} />
  </div></div>
  <div className="admin-two"><UploadCard title="Logo" value={profile.logoUrl || ""} accept="image/*" folder="logo" supabase={supabase} onUploaded={(url) => set("logoUrl", url)} setNotice={setNotice} /><UploadCard title="Profile image" value={profile.avatarUrl} accept="image/*" folder="profile" supabase={supabase} onUploaded={(url) => set("avatarUrl", url)} setNotice={setNotice} /><UploadCard title="Current resume" value={profile.resumeUrl} accept="application/pdf" folder="resume" supabase={supabase} onUploaded={(url) => { setContent({ ...content, profile: { ...profile, resumeUrl: url, resumeUpdatedAt: new Date().toISOString().slice(0, 10) } }); }} setNotice={setNotice} /></div>
  <div className="admin-form-card"><h2>Social links</h2><LinkEditor links={profile.socials} onChange={(links) => set("socials", links)} /></div></div>;
}

type EditorProps = { content: PortfolioContent; setContent: (content: PortfolioContent) => void };
function AboutEditor({ content, setContent }: EditorProps) {
  const about = content.about; const set = (key: keyof typeof about, value: unknown) => setContent({ ...content, about: { ...about, [key]: value } });
  return <div className="admin-form-card"><h2>About narrative</h2><div className="form-grid"><Field label="Heading" value={about.heading} onChange={(v) => set("heading", v)} textarea full /><Field label="Paragraphs (one per line)" value={about.paragraphs.join("\n")} onChange={(v) => set("paragraphs", splitLines(v))} textarea full /><Field label="Principles (one per line)" value={about.principles.join("\n")} onChange={(v) => set("principles", splitLines(v))} textarea /><Field label="Interests (one per line)" value={about.interests.join("\n")} onChange={(v) => set("interests", splitLines(v))} textarea /></div></div>;
}

function SkillsEditor({ content, setContent }: EditorProps) {
  const update = (index: number, group: SkillGroup) => { const skills = [...content.skills]; skills[index] = group; setContent({ ...content, skills }); };
  return <div className="admin-stack">{content.skills.map((group, index) => <div className="admin-form-card" key={group.id}><div className="editor-card-title"><h2>Skill group {index + 1}</h2><button className="icon-button danger-text" onClick={() => setContent({ ...content, skills: content.skills.filter((_, i) => i !== index) })}><Trash2 /></button></div><div className="form-grid"><Field label="Title" value={group.title} onChange={(v) => update(index, { ...group, title: v })} /><Field label="Description" value={group.description} onChange={(v) => update(index, { ...group, description: v })} /><Field label="Skills (one per line)" value={group.skills.join("\n")} onChange={(v) => update(index, { ...group, skills: splitLines(v) })} textarea full /></div></div>)}<button className="button secondary" onClick={() => setContent({ ...content, skills: [...content.skills, { id: uid("skill"), title: "New skill group", description: "", skills: [] }] })}><Plus /> Add skill group</button></div>;
}

function CollectionEditor({ name, content, setContent, supabase, setNotice }: EditorProps & { name: CollectionName; supabase: NonNullable<ReturnType<typeof createSupabaseClient>>; setNotice: (value: string) => void }) {
  const items = content[name]; const [selectedId, setSelectedId] = useState(items[0]?.id || ""); const selected = items.find((item) => item.id === selectedId) || null;
  useEffect(() => { if (items.length && !items.some((item) => item.id === selectedId)) setSelectedId(items[0].id); }, [items, selectedId]);
  const update = (item: ContentItem) => setContent({ ...content, [name]: items.map((current) => current.id === item.id ? item : current) });
  const add = () => { const item = emptyItem(name); setContent({ ...content, [name]: [...items, item] }); setSelectedId(item.id); };
  const remove = (id: string) => { if (!confirm("Delete this item? This is saved permanently only after Save & publish.")) return; setContent({ ...content, [name]: items.filter((item) => item.id !== id) }); };
  const move = (index: number, direction: number) => { const target = index + direction; if (target < 0 || target >= items.length) return; const next = [...items]; [next[index], next[target]] = [next[target], next[index]]; setContent({ ...content, [name]: next }); };
  return <div className="collection-layout"><aside className="collection-list"><button className="button" onClick={add}><Plus size={16} /> Add {singular(name)}</button>{items.map((item, index) => <div className={`collection-list-item ${selectedId === item.id ? "active" : ""}`} key={item.id}><button onClick={() => setSelectedId(item.id)}><strong>{item.title || "Untitled"}</strong><span>{item.published ? "Published" : "Draft"}</span></button><div><button onClick={() => move(index, -1)} disabled={index === 0}><ArrowUp /></button><button onClick={() => move(index, 1)} disabled={index === items.length - 1}><ArrowDown /></button><button onClick={() => remove(item.id)}><Trash2 /></button></div></div>)}</aside>{selected ? <ItemEditor item={selected} onChange={update} name={name} supabase={supabase} setNotice={setNotice} /> : <div className="empty-state"><h2>No {name} yet</h2><p>Add the first entry to begin.</p></div>}</div>;
}

function ItemEditor({ item, onChange, name, supabase, setNotice }: { item: ContentItem; onChange: (item: ContentItem) => void; name: CollectionName; supabase: NonNullable<ReturnType<typeof createSupabaseClient>>; setNotice: (value: string) => void }) {
  const set = (key: keyof ContentItem, value: unknown) => onChange({ ...item, [key]: value });
  const acceptsPdf = true;
  return <div className="admin-stack"><div className="admin-form-card"><div className="editor-card-title"><div><h2>{item.title || `New ${singular(name)}`}</h2><p>Only fields with content appear on the public site.</p></div><div className="toggle-row"><label><input type="checkbox" checked={item.published} onChange={(e) => set("published", e.target.checked)} /> Published</label><label><input type="checkbox" checked={item.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured</label></div></div><div className="form-grid">
    <Field label="Title" value={item.title} onChange={(v) => set("title", v)} /><Field label="URL slug" value={item.slug} onChange={(v) => set("slug", slugify(v))} />
    <Field label="Subtitle" value={item.subtitle || ""} onChange={(v) => set("subtitle", v)} /><Field label="Category" value={item.category || ""} onChange={(v) => set("category", v)} />
    <Field label="Short summary" value={item.summary} onChange={(v) => set("summary", v)} textarea full /><Field label="Full description" value={item.description || ""} onChange={(v) => set("description", v)} textarea full />
    <Field label="Organization / issuer" value={item.organization || ""} onChange={(v) => set("organization", v)} /><Field label="Role" value={item.role || ""} onChange={(v) => set("role", v)} />
    <Field label="Date label" value={item.date || ""} onChange={(v) => set("date", v)} /><Field label="Status" value={item.status || ""} onChange={(v) => set("status", v)} />
    <Field label="Start date" value={item.startDate || ""} onChange={(v) => set("startDate", v)} /><Field label="End date" value={item.endDate || ""} onChange={(v) => set("endDate", v)} />
    <Field label="Location" value={item.location || ""} onChange={(v) => set("location", v)} /><Field label="Cover image URL" value={item.coverImage || ""} onChange={(v) => set("coverImage", v)} />
    <Field label="Tags (one per line)" value={item.tags.join("\n")} onChange={(v) => set("tags", splitLines(v))} textarea /><Field label="Highlights (one per line)" value={item.highlights.join("\n")} onChange={(v) => set("highlights", splitLines(v))} textarea />
    <Field label="Metrics (one per line)" value={(item.metrics || []).join("\n")} onChange={(v) => set("metrics", splitLines(v))} textarea full />
  </div></div>
  <div className="admin-form-card"><h2>Media gallery</h2><MediaEditor media={item.media} onChange={(media) => set("media", media)} folder={name} supabase={supabase} setNotice={setNotice} /><div style={{ marginTop: 16 }}><label className="field"><span>{acceptsPdf ? "Upload images, video, or PDF documents" : "Upload images or video"}</span><input type="file" multiple accept={acceptsPdf ? "image/*,video/mp4,video/webm,application/pdf" : "image/*,video/mp4,video/webm"} onChange={async (event) => { const files = Array.from(event.target.files || []); const uploaded = await uploadFiles(files, name, supabase, setNotice); set("media", [...item.media, ...uploaded]); event.target.value = ""; }} /></label></div></div>
  <div className="admin-form-card"><h2>External links</h2><LinkEditor links={item.links} onChange={(links) => set("links", links)} /></div>
  {name === "projects" || name === "papers" ? <div className="admin-form-card"><h2>Detailed sections</h2><SectionEditor sections={item.sections || []} onChange={(sections) => set("sections", sections)} /></div> : null}</div>;
}

function ClubEditor({ content, setContent, supabase, setNotice }: EditorProps & { supabase: NonNullable<ReturnType<typeof createSupabaseClient>>; setNotice: (v: string) => void }) {
  const club = content.club; const set = (key: keyof typeof club, value: unknown) => setContent({ ...content, club: { ...club, [key]: value } });
  return <div className="admin-stack"><div className="admin-form-card"><div className="editor-card-title"><h2>Club profile</h2><label className="toggle-row"><input type="checkbox" checked={club.enabled} onChange={(e) => set("enabled", e.target.checked)} /> Show club page</label></div><div className="form-grid"><Field label="Club name" value={club.name} onChange={(v) => set("name", v)} /><Field label="Your role" value={club.role} onChange={(v) => set("role", v)} /><Field label="Short summary" value={club.summary} onChange={(v) => set("summary", v)} textarea full /><Field label="Full description" value={club.description} onChange={(v) => set("description", v)} textarea full /></div></div><div className="admin-form-card"><h2>Club media</h2><MediaEditor media={club.media} onChange={(media) => set("media", media)} folder="club" supabase={supabase} setNotice={setNotice} /><label className="field" style={{ marginTop: 16 }}><span>Upload media</span><input type="file" multiple accept="image/*,video/*" onChange={async (event) => { set("media", [...club.media, ...await uploadFiles(Array.from(event.target.files || []), "club", supabase, setNotice)]); event.target.value = ""; }} /></label></div><div className="admin-form-card"><h2>Club links</h2><LinkEditor links={club.links} onChange={(links) => set("links", links)} /></div></div>;
}

function SettingsEditor({ content, setContent }: EditorProps) { const settings = content.settings; return <div className="admin-form-card"><h2>Site metadata</h2><div className="form-grid"><Field label="Site title" value={settings.siteTitle} onChange={(siteTitle) => setContent({ ...content, settings: { ...settings, siteTitle } })} full /><Field label="Site description" value={settings.siteDescription} onChange={(siteDescription) => setContent({ ...content, settings: { ...settings, siteDescription } })} textarea full /></div></div>; }

function Field({ label, value, onChange, textarea = false, full = false }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; full?: boolean }) { const id = useId(); return <div className={`field ${full ? "full" : ""}`}><label htmlFor={id}>{label}</label>{textarea ? <textarea id={id} className="textarea" value={value} onChange={(e) => onChange(e.target.value)} /> : <input id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)} />}</div>; }

function LinkEditor({ links, onChange }: { links: LinkItem[]; onChange: (links: LinkItem[]) => void }) { return <div className="repeat-list">{links.map((item, index) => <div className="repeat-row links" key={item.id}><select className="select" aria-label="Link type" value={item.kind} onChange={(e) => { const next = [...links]; next[index] = { ...item, kind: e.target.value as LinkItem["kind"] }; onChange(next); }}>{["github","live","paper","doi","youtube","instagram","linkedin","website","custom"].map((kind) => <option key={kind}>{kind}</option>)}</select><input className="input" aria-label="Link label" placeholder="Label" value={item.label} onChange={(e) => { const next = [...links]; next[index] = { ...item, label: e.target.value }; onChange(next); }} /><input className="input" aria-label="Link URL" placeholder="https://…" value={item.url} onChange={(e) => { const next = [...links]; next[index] = { ...item, url: e.target.value }; onChange(next); }} /><button className="icon-button" aria-label="Remove link" onClick={() => onChange(links.filter((_, i) => i !== index))}><Trash2 /></button></div>)}<button className="button secondary small" onClick={() => onChange([...links, { id: uid("link"), label: "New link", url: "", kind: "custom" }])}><Plus size={15} /> Add link</button></div>; }

function MediaEditor({ media, onChange, folder, supabase, setNotice }: { media: MediaItem[]; onChange: (media: MediaItem[]) => void; folder: string; supabase: NonNullable<ReturnType<typeof createSupabaseClient>>; setNotice: (value: string) => void }) {
  return <div className="media-admin-grid">{media.map((item, index) => <div className="media-admin-card" key={item.id}>
    {item.type === "image" ? <img src={item.url} alt="" /> : item.type === "video" ? <div className="admin-video-preview">{item.thumbnailUrl ? <img src={item.thumbnailUrl} alt="" /> : <video src={`${item.url}#t=0.1`} muted playsInline preload="metadata" />}<Play /></div> : <div className="media-admin-document"><FileText /><span>{item.caption || item.alt || "PDF document"}</span><a href={item.url} target="_blank" rel="noreferrer">Open PDF <ExternalLink size={13} /></a></div>}
    <div className="field"><label>Alt text / document name</label><input className="input" value={item.alt} onChange={(e) => { const next = [...media]; next[index] = { ...item, alt: e.target.value }; onChange(next); }} /></div>
    <div className="field"><label>Caption</label><input className="input" value={item.caption || ""} onChange={(e) => { const next = [...media]; next[index] = { ...item, caption: e.target.value }; onChange(next); }} /></div>
    {item.type === "video" ? <label className="button secondary small file-button media-thumbnail-upload"><ImagePlus size={14} />{item.thumbnailUrl ? "Replace thumbnail" : "Add thumbnail"}<input type="file" accept="image/*" onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; const uploaded = await uploadFiles([file], `${folder}/thumbnails`, supabase, setNotice); if (uploaded[0]) { const next = [...media]; next[index] = { ...item, thumbnailUrl: uploaded[0].url }; onChange(next); } event.target.value = ""; }} /></label> : null}
    <div className="media-actions"><button aria-label="Move media up" onClick={() => { const next = [...media]; if (index > 0) [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(next); }}><ArrowUp /></button><button aria-label="Remove media" onClick={() => onChange(media.filter((_, i) => i !== index))}><Trash2 /></button></div>
  </div>)}</div>;
}

function SectionEditor({ sections, onChange }: { sections: CaseStudySection[]; onChange: (sections: CaseStudySection[]) => void }) { return <div className="repeat-list">{sections.map((section, index) => <div className="section-editor" key={section.id}><div className="editor-card-title"><strong>Section {index + 1}</strong><button className="icon-button" onClick={() => onChange(sections.filter((_, i) => i !== index))}><Trash2 /></button></div><Field label="Heading" value={section.title} onChange={(title) => { const next = [...sections]; next[index] = { ...section, title }; onChange(next); }} /><Field label="Body" value={section.body} textarea onChange={(body) => { const next = [...sections]; next[index] = { ...section, body }; onChange(next); }} /></div>)}<button className="button secondary small" onClick={() => onChange([...sections, { id: uid("section"), title: "New section", body: "" }])}><Plus size={15} /> Add section</button></div>; }

function UploadCard({ title, value, accept, folder, supabase, onUploaded, setNotice }: { title: string; value: string; accept: string; folder: string; supabase: NonNullable<ReturnType<typeof createSupabaseClient>>; onUploaded: (url: string) => void; setNotice: (v: string) => void }) { const [busy, setBusy] = useState(false); return <div className="admin-form-card upload-card"><h2>{title}</h2>{value ? (accept.includes("pdf") ? <a href={value} target="_blank" rel="noreferrer"><FileText /> Open current file</a> : <img src={value} alt="Current upload" />) : <div className="upload-placeholder"><ImagePlus /><span>No file uploaded</span></div>}{value ? <button className="button secondary small" type="button" onClick={() => onUploaded("")}>Remove file</button> : null}<label className="button secondary"><Upload size={16} />{busy ? "Uploading…" : "Choose file"}<input type="file" accept={accept} disabled={busy} onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; setBusy(true); const media = await uploadFiles([file], folder, supabase, setNotice); if (media[0]) onUploaded(media[0].url); setBusy(false); }} /></label></div>; }

async function uploadFiles(files: File[], folder: string, supabase: NonNullable<ReturnType<typeof createSupabaseClient>>, setNotice: (value: string) => void) {
  const media: MediaItem[] = [];
  for (const file of files) {
    if (file.size > 50 * 1024 * 1024) { setNotice(`${file.name} is larger than the 50 MB upload limit.`); continue; }
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const path = `${folder}/${stamp}-${safe}`;
    const { error } = await supabase.storage.from("portfolio-media").upload(path, file, { contentType: file.type, upsert: false });
    if (error) { setNotice(error.message); continue; }
    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path);
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const type: MediaItem["type"] = isPdf ? "pdf" : file.type.startsWith("video") ? "video" : "image";
    let thumbnailUrl: string | undefined;
    if (type === "video") {
      const thumbnail = await createVideoThumbnail(file);
      if (thumbnail) {
        const thumbnailPath = `${folder}/thumbnails/${stamp}-${safe.replace(/\.[^.]+$/, "")}.jpg`;
        const { error: thumbnailError } = await supabase.storage.from("portfolio-media").upload(thumbnailPath, thumbnail, { contentType: "image/jpeg", upsert: false });
        if (!thumbnailError) thumbnailUrl = supabase.storage.from("portfolio-media").getPublicUrl(thumbnailPath).data.publicUrl;
      }
    }
    media.push({ id: uid("media"), url: data.publicUrl, type, alt: file.name.replace(/\.[^.]+$/, ""), caption: "", ...(thumbnailUrl ? { thumbnailUrl } : {}) });
  }
  return media;
}

async function createVideoThumbnail(file: File): Promise<Blob | null> {
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  try {
    const metadataReady = waitForVideo(video, "loadedmetadata");
    video.src = objectUrl;
    video.load();
    await metadataReady;
    video.currentTime = Number.isFinite(video.duration) ? Math.min(Math.max(video.duration * .05, .1), 1) : .1;
    await waitForVideo(video, "seeked");
    const maxWidth = 1280;
    const scale = Math.min(1, maxWidth / video.videoWidth);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", .84));
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function waitForVideo(video: HTMLVideoElement, event: "loadedmetadata" | "seeked") {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => { cleanup(); reject(new Error("Video preview timed out.")); }, 8000);
    const done = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error("Video preview could not be generated.")); };
    const cleanup = () => { window.clearTimeout(timer); video.removeEventListener(event, done); video.removeEventListener("error", failed); };
    video.addEventListener(event, done, { once: true });
    video.addEventListener("error", failed, { once: true });
  });
}

function emptyItem(name: CollectionName): ContentItem { const label = singular(name); return { id: uid(name), slug: `new-${label.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`, title: `New ${label}`, subtitle: "", summary: "", description: "", organization: "", role: "", location: "", startDate: "", endDate: "", date: "", status: "Draft", category: "", coverImage: "", featured: false, published: false, tags: [], highlights: [], metrics: [], media: [], links: [], sections: [] }; }
function singular(name: CollectionName) { return ({ projects: "project", papers: "paper", certificates: "certificate", events: "event", education: "education entry", experience: "experience entry", updates: "update" } as const)[name]; }
function splitLines(value: string) { return value.split("\n").map((item) => item.trim()).filter(Boolean); }
function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
