import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { Header, F, Grid2, SaveBtn, priBtn, secBtn, danBtn } from "./AProfile";
import api from "../../lib/api";

const emptyExp  = () => ({ role:"", company:"", startDate:"", endDate:"", current:false, description:"" });
const emptyEdu  = () => ({ institution:"", degree:"", field:"", startDate:"", endDate:"" });
const emptySkillGroup = () => ({ category:"", items:[""] });

export default function AResume() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ experience:[], education:[], skills:[] });
  const [saved, setSaved] = useState(false);

  const { data: resume } = useQuery({ queryKey: ["resume"], queryFn: () => api.get("/api/resume").then(r => r.data) });

  useEffect(() => {
    if (resume) setForm({ experience: resume.experience||[], education: resume.education||[], skills: resume.skills||[] });
  }, [resume]);

  const saveMut = useMutation({
    mutationFn: () => api.put("/api/resume", form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["resume"] }); setSaved(true); setTimeout(() => setSaved(false), 2500); },
  });

  const updExp = (i, k, v) => setForm(f => ({ ...f, experience: f.experience.map((e,idx) => idx===i ? {...e,[k]:v} : e) }));
  const updEdu = (i, k, v) => setForm(f => ({ ...f, education: f.education.map((e,idx) => idx===i ? {...e,[k]:v} : e) }));
  const updSG  = (i, k, v) => setForm(f => ({ ...f, skills: f.skills.map((s,idx) => idx===i ? {...s,[k]:v} : s) }));
  const updSI  = (gi,si,v)  => setForm(f => ({ ...f, skills: f.skills.map((s,idx) => idx===gi ? {...s,items:s.items.map((it,ii)=>ii===si?v:it)} : s) }));

  return (
    <div style={{ maxWidth: 780 }}>
      <Header title="Resume" sub="Edit experience, education and skills.">
        <SaveBtn saved={saved} pending={saveMut.isPending} onClick={() => saveMut.mutate()} />
      </Header>

      {/* Experience */}
      <Section title="Experience" onAdd={() => setForm(f => ({ ...f, experience:[...f.experience, emptyExp()] }))}>
        {form.experience.map((e,i) => (
          <div key={i} style={card}>
            <Grid2>
              <F label="Role"><input value={e.role} onChange={ev => updExp(i,"role",ev.target.value)} className="field-input" placeholder="Job title" /></F>
              <F label="Company"><input value={e.company} onChange={ev => updExp(i,"company",ev.target.value)} className="field-input" placeholder="Company name" /></F>
              <F label="Start date"><input value={e.startDate} onChange={ev => updExp(i,"startDate",ev.target.value)} className="field-input" placeholder="Jan 2022" /></F>
              <F label="End date"><input value={e.endDate} onChange={ev => updExp(i,"endDate",ev.target.value)} className="field-input" placeholder="Dec 2023" disabled={e.current} /></F>
            </Grid2>
            <label style={{ display:"flex", alignItems:"center", gap:8, fontSize:"0.85rem", color:"var(--text2)", margin:"0.75rem 0", cursor:"pointer" }}>
              <input type="checkbox" checked={e.current} onChange={ev => updExp(i,"current",ev.target.checked)} />
              Currently working here
            </label>
            <F label="Description">
              <textarea value={e.description} onChange={ev => updExp(i,"description",ev.target.value)} rows={3} className="field-input" style={{ resize:"vertical" }} placeholder="What you did here…" />
            </F>
            <div style={{ display:"flex", justifyContent:"flex-end", marginTop:"0.75rem" }}>
              <button onClick={() => setForm(f=>({...f,experience:f.experience.filter((_,idx)=>idx!==i)}))} style={danBtn}><Trash2 size={12}/> Remove</button>
            </div>
          </div>
        ))}
        {form.experience.length === 0 && <p style={{color:"var(--text3)",fontSize:"0.85rem"}}>No entries yet.</p>}
      </Section>

      {/* Education */}
      <Section title="Education" onAdd={() => setForm(f => ({ ...f, education:[...f.education, emptyEdu()] }))}>
        {form.education.map((e,i) => (
          <div key={i} style={card}>
            <Grid2>
              <F label="Institution"><input value={e.institution} onChange={ev => updEdu(i,"institution",ev.target.value)} className="field-input" placeholder="University name" /></F>
              <F label="Degree"><input value={e.degree} onChange={ev => updEdu(i,"degree",ev.target.value)} className="field-input" placeholder="BSc" /></F>
              <F label="Field of study"><input value={e.field} onChange={ev => updEdu(i,"field",ev.target.value)} className="field-input" placeholder="Computer Science" /></F>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
                <F label="From"><input value={e.startDate} onChange={ev => updEdu(i,"startDate",ev.target.value)} className="field-input" placeholder="2018" /></F>
                <F label="To"><input value={e.endDate} onChange={ev => updEdu(i,"endDate",ev.target.value)} className="field-input" placeholder="2022" /></F>
              </div>
            </Grid2>
            <div style={{display:"flex",justifyContent:"flex-end",marginTop:"0.75rem"}}>
              <button onClick={() => setForm(f=>({...f,education:f.education.filter((_,idx)=>idx!==i)}))} style={danBtn}><Trash2 size={12}/> Remove</button>
            </div>
          </div>
        ))}
        {form.education.length === 0 && <p style={{color:"var(--text3)",fontSize:"0.85rem"}}>No entries yet.</p>}
      </Section>

      {/* Skills */}
      <Section title="Skills" onAdd={() => setForm(f => ({ ...f, skills:[...f.skills, emptySkillGroup()] }))}>
        {form.skills.map((g,gi) => (
          <div key={gi} style={card}>
            <F label="Category name" style={{marginBottom:"0.75rem"}}>
              <input value={g.category} onChange={e => updSG(gi,"category",e.target.value)} className="field-input" placeholder="Frontend, Backend, Tools…" />
            </F>
            <div style={{display:"flex",flexWrap:"wrap",gap:"0.5rem",marginBottom:"0.75rem"}}>
              {g.items.map((item,si) => (
                <div key={si} style={{display:"flex",alignItems:"center",gap:4}}>
                  <input value={item} onChange={e => updSI(gi,si,e.target.value)} className="field-input" style={{width:110,padding:"0.4rem 0.6rem"}} placeholder="Skill" />
                  <button onClick={() => setForm(f=>({...f,skills:f.skills.map((s,idx)=>idx===gi?{...s,items:s.items.filter((_,ii)=>ii!==si)}:s)}))} style={{...danBtn,padding:"0.3rem 0.4rem"}}><Trash2 size={11}/></button>
                </div>
              ))}
              <button onClick={() => setForm(f=>({...f,skills:f.skills.map((s,idx)=>idx===gi?{...s,items:[...s.items,""]}:s)}))} style={secBtn}><Plus size={13}/> Add skill</button>
            </div>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <button onClick={() => setForm(f=>({...f,skills:f.skills.filter((_,idx)=>idx!==gi)}))} style={danBtn}><Trash2 size={12}/> Remove group</button>
            </div>
          </div>
        ))}
        {form.skills.length === 0 && <p style={{color:"var(--text3)",fontSize:"0.85rem"}}>No skill groups yet.</p>}
      </Section>

      <div style={{display:"flex",justifyContent:"flex-end",paddingBottom:"2rem"}}>
        <SaveBtn saved={saved} pending={saveMut.isPending} onClick={() => saveMut.mutate()} large />
      </div>
    </div>
  );
}

function Section({ title, onAdd, children }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <h2 style={{ fontSize:"1.05rem", fontWeight:700 }}>{title}</h2>
        <button onClick={onAdd} style={secBtn}><Plus size={13}/> Add</button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>{children}</div>
    </div>
  );
}

const card = { background:"var(--surface)", border:"1px solid var(--border)", borderRadius:12, padding:"1.2rem" };
