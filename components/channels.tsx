import {useState,Dispatch,SetStateAction} from 'react'
import {Button} from './ui/button'
import {Pill,Wave} from './overview'
import {Modal} from './studio'
import {Clip,Post,Claim,days} from '@/lib/episode'
import {ShieldCheck,ShieldAlert,Check,CalendarPlus,FlaskConical,ArrowUpRight,Languages,TrendingUp,BarChart3} from 'lucide-react'

const platforms=['Instagram Reel','LinkedIn','WhatsApp','YouTube Short']

export function Platform({clips,mix,setMix,platform,setPlatform,add}:{clips:Clip[],mix:number,setMix:(n:number)=>void,platform:string,setPlatform:(s:string)=>void,add:(id:number)=>void}){
  const remaining=clips.filter(c=>c.status!=='Rejected')
  const [id,choose]=useState(remaining[0]?.id||1)
  const c=remaining.find(c=>c.id===id)||remaining[0]

  if(!c) return <section className="panel padded">No remaining clips to repurpose.</section>

  // Determine platform copy dynamically from the clip
  let caption = ''
  if (platform === 'Instagram Reel') {
    caption = c.platformCaptions?.reel || `🎬 "${c.excerpt}"\n\nCuriosity hook: What happens when you focus on one core problem? Watch the founder break it down.\n\n#EchoLab #${c.kind.replace(/\s+/g, '')} #Reels`
  } else if (platform === 'LinkedIn') {
    caption = c.platformCaptions?.linkedin || `Insight from our latest session:\n\n"${c.excerpt}"\n\nKey takeaways:\n• Focus on real conversations, not assumptions\n• Early validation prevents wasted roadmap cycles\n• Ground every claim in direct user observation\n\nWhat is your team's feedback ritual this week?`
  } else if (platform === 'WhatsApp') {
    caption = c.platformCaptions?.whatsapp || `💡 Quick founder takeaway:\n\n"${c.excerpt}"\n\nShare this with anyone building their first product! 🚀`
  } else {
    caption = c.platformCaptions?.youtube || c.platformCaptions?.reel || `🔥 ${c.title}: "${c.excerpt}"\n\nSubscribe for more practical founder insights!`
  }

  const charLimits:{[k:string]:number}={'Instagram Reel':2200,'LinkedIn':3000,'WhatsApp':1024,'YouTube Short':1000}
  const limit=charLimits[platform]||2000
  const remaining_chars=limit-caption.length

  return <div className="studio-grid">
    <section className="panel padded">
      <div className="eyebrow"><Languages size={15}/> MULTIMODAL CAPTION ENGINE</div>
      <h2>Adapt a clip</h2>
      <p className="muted">Generate platform-tailored copy from this video moment. Structure, length, tone, and call-to-action adapt per platform.</p>
      <label>Source clip<select value={c.id} onChange={e=>choose(+e.target.value)}>{remaining.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
      <label>Platform<select value={platform} onChange={e=>setPlatform(e.target.value)}>{platforms.map(p=><option key={p}>{p}</option>)}</select></label>
      <label>Language mix control<input type="range" value={mix} onChange={e=>setMix(+e.target.value)}/></label>
      <div className="range-label"><span>English {100-mix}%</span><span>Regional / Telugu {mix}%</span></div>
      {c.languageMix&&<small className="muted" style={{marginTop:'6px',display:'block'}}>Source clip language: {c.languageMix}</small>}
    </section>

    <section className="panel padded">
      <div className="eyebrow">PLATFORM-SPECIFIC COPY</div>
      <h2>{platform}</h2>
      <div className="actions">
        <Pill>{c.time} · Clip 0{c.id}</Pill>
        <Pill tone="amber">{c.kind}</Pill>
        <Pill tone={remaining_chars>=0?'green':'amber'}>{caption.length} chars</Pill>
      </div>
      <blockquote key={caption+platform} className="reveal" style={{whiteSpace:'pre-wrap'}}>{caption}</blockquote>
      {c.risk&&c.risk.includes('Held')&&<p className="warning"><ShieldAlert size={14}/> This clip contains a held claim. Creator approval required in Claim Firewall before publishing.</p>}
      <Button onClick={()=>add(c.id)}><CalendarPlus/>Add draft to calendar</Button>
    </section>
  </div>
}

export function Calendar({posts,setPosts,clips,held}:{posts:Post[],setPosts:Dispatch<SetStateAction<Post[]>>,clips:Clip[],held:boolean}){
  const [day,setDay]=useState(0)
  const [edit,setEdit]=useState<number|null>(null)
  const [form,setForm]=useState<Post>(posts[0]||{day:0,clip:1,platform:platforms[0],time:'10:00',status:'Draft'})
  const available=clips.filter(c=>c.status!=='Rejected')

  return <>
    <div className="panel padded">
      <div className="row">
        <div>
          <div className="eyebrow">7-DAY PLANNER</div>
          <h2>Content publishing calendar</h2>
        </div>
        <Button disabled={!available.length} onClick={()=>{setForm({day,clip:available[0].id,platform:platforms[0],time:'10:00',status:'Draft'});setEdit(-1)}}>Add post</Button>
      </div>
      <div className="week">
        {days.map((d,i)=><button key={d} aria-pressed={day===i} className={day===i?'selected':''} onClick={()=>setDay(i)}>
          {d}<b>{23+i}</b><small>{posts.filter(p=>p.day===i).length} posts</small>
        </button>)}
      </div>
      <h2>{days[day]} agenda</h2>
      {posts.map((p,i)=>p.day===day&&<div key={i} className="rule-row">
        <span className="clip-meta">{p.time}</span>
        <div className="grow">
          <small>{p.platform}</small>
          <h3>{clips.find(c=>c.id===p.clip)?.title || `Clip ${p.clip}`}</h3>
        </div>
        <Pill tone={p.status==='Awaiting claim approval'?'amber':'green'}>{p.status}</Pill>
        <Button variant="outline" onClick={()=>{setEdit(i);setForm(p)}}>Edit</Button>
      </div>)}
      {!posts.some(p=>p.day===day)&&<p className="muted">Nothing planned for this day. Click "Add post" or adapt a clip in Platform Content.</p>}
    </div>

    {edit!==null&&<Modal title={edit===-1?'Plan a post':'Edit post'} close={()=>setEdit(null)}>
      <form onSubmit={e=>{e.preventDefault();setPosts(ps=>edit===-1?[...ps,form]:ps.map((p,i)=>i===edit?form:p));setDay(form.day);setEdit(null)}}>
        <label>Clip<select value={form.clip} onChange={e=>setForm({...form,clip:+e.target.value,status:'Draft'})}>{available.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}</select></label>
        <label>Channel<select value={form.platform} onChange={e=>setForm({...form,platform:e.target.value})}>{platforms.map(v=><option key={v}>{v}</option>)}</select></label>
        <label>Day<select value={form.day} onChange={e=>setForm({...form,day:+e.target.value})}>{days.map((d,i)=><option value={i} key={d}>{d}, Nov {23+i}</option>)}</select></label>
        <label>Time<input type="time" required value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/></label>
        <label>Status<select value={form.status} onChange={e=>setForm({...form,status:e.target.value as Post['status']})}>
          {(['Draft','Awaiting claim approval','Approved','Scheduled'] as const).map(s=><option key={s} disabled={held&&form.clip===4&&['Approved','Scheduled'].includes(s)}>{s}</option>)}
        </select></label>
        <Button>Save post</Button>
      </form>
    </Modal>}
  </>
}

export function Analytics({sim,simulate,clips,review}:{sim:boolean,simulate:()=>void,clips:Clip[],review:(c:Clip)=>void}){
  return <>
    <section className="panel padded">
      <div className="eyebrow"><FlaskConical/> SIMULATED DATA</div>
      <h2>Content performance lab</h2>
      <p>Test how two weeks of simulated retention data influence your next edit. EchoLab reruns its recommendation engine with the new signals and reorders your clip candidates with clear confidence labels.</p>
      <Button disabled={sim} onClick={simulate}>{sim?'14-day simulation complete':'Simulate 14 days of analytics'}</Button>
    </section>

    {sim&&<div className="studio-grid reveal">
      <section className="panel padded">
        <Pill>Simulated signal</Pill>
        <h2><TrendingUp size={18} style={{display:'inline',marginRight:'8px'}}/>Question hooks: 2.4× 3-second retention</h2>
        <p>Retention signals showed question-style opening hooks retained viewers 2.4× longer in the first 3 seconds. Recommendation weight adjusted +30%.</p>
        <small className="muted">Based on 6 posts · Low confidence · Directional signal only</small>
      </section>
      <section className="panel padded">
        <Pill>Simulated signal</Pill>
        <h2><BarChart3 size={18} style={{display:'inline',marginRight:'8px'}}/>Bilingual code-switched hooks: 1.8× share rate</h2>
        <p>Clips opening with natural regional-English code-switching had higher share rates on Instagram Reels and WhatsApp Status.</p>
        <small className="muted">Based on 4 posts · Directional signal</small>
      </section>
    </div>}

    <section className="panel padded">
      <div className="eyebrow">RECOMMENDATION ORDER</div>
      <h2>{sim?'Updated clip rankings (Retention re-weighted)':'Baseline clip rankings'}</h2>
      <p className="muted">{sim?'Rankings reordered by simulated performance signals. Question hooks promoted to the top.':'Ranked by multimodal AI confidence score.'}</p>
      {clips.filter(c=>c.status!=='Rejected').map((c,i)=><button className="ranking" key={c.id} onClick={()=>review(c)}>
        <b>0{i+1}</b>
        <Wave id={c.id}/>
        <span className="grow">
          <h3>{c.title}</h3>
          <small>{c.kind}{c.score>0?` · ${c.score}% confidence`:''}</small>
        </span>
        <ArrowUpRight size={15}/>
      </button>)}
    </section>
  </>
}

export function Firewall({claims,clips,approveClaim,editClaim}:{claims:Claim[],clips:Clip[],approveClaim:(id:number)=>void,editClaim:(id:number,text:string)=>void}){
  const [editing,change]=useState<number|null>(null)
  const [v,setV]=useState('')

  const held=claims.filter(c=>c.status==='Held for review').length
  const verified=claims.filter(c=>c.status==='Verified from source').length
  const approved=claims.filter(c=>c.status==='Creator-approved').length

  return <>
    <div className="statgrid" style={{gridTemplateColumns:'repeat(3,1fr)',marginBottom:'18px'}}>
      <div className="stat panel">
        <div className="stat-top"><span className="iconbox"><ShieldCheck size={18}/></span></div>
        <div className="stat-number">{String(verified).padStart(2,'0')}</div>
        <b>Verified from source</b>
        <small>Backed by timestamp in video recording</small>
      </div>
      <div className="stat panel">
        <div className="stat-top"><span className="iconbox tone1"><Check size={18}/></span></div>
        <div className="stat-number">{String(approved).padStart(2,'0')}</div>
        <b>Creator-approved</b>
        <small>Confirmed by creator decision</small>
      </div>
      <div className="stat panel">
        <div className="stat-top"><span className="iconbox" style={{background:'#fbefd9',color:'#92621d'}}><ShieldAlert size={18}/></span></div>
        <div className="stat-number">{String(held).padStart(2,'0')}</div>
        <b>Held for review</b>
        <small>Comparative, pricing, or unbacked claim</small>
      </div>
    </div>

    <section className="panel padded">
      <div className="eyebrow"><ShieldCheck/> SOURCE EVIDENCE</div>
      <h2>Episode claims</h2>
      <p className="muted">Claim Firewall extracts each factual statement from the recording and holds any claim the recording doesn't back. It checks evidence, not truth.</p>

      {claims.map(c=><div key={c.id} className="claim-row">
        <Pill tone={c.status==='Held for review'?'amber':'green'}>{c.status}</Pill>
        <Pill tone="amber">{c.category}</Pill>
        <h3>"{c.text}"</h3>
        <p>{c.evidence}</p>
        {c.timestamp&&<small className="muted" style={{display:'block',marginTop:'4px'}}>Source timestamp: {c.timestamp}</small>}
        <div className="actions">
          {c.status==='Held for review'&&<Button onClick={()=>approveClaim(c.id)}><Check/>Approve claim</Button>}
          <Button variant="outline" onClick={()=>{setV(c.text);change(c.id)}}>Edit wording</Button>
        </div>
      </div>)}
    </section>

    {editing!==null&&<Modal title="Edit claim" close={()=>change(null)}>
      <label>Claim wording<textarea value={v} onChange={e=>setV(e.target.value)}/></label>
      <Button disabled={!v.trim()} onClick={()=>{editClaim(editing,v.trim());change(null)}}>Save for review</Button>
    </Modal>}
  </>
}
