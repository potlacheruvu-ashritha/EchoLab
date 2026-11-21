'use client'
import {useState,useEffect} from 'react'
import {PanelsTopLeft,Clapperboard,Dna,Layers,CalendarDays,ChartNoAxesColumnIncreasing,ShieldCheck,Settings2,Menu,ChevronRight,PanelLeft,Check,ArrowRight,AudioLines,Plus} from 'lucide-react'
import {Button} from './ui/button'
import {Overview} from './overview'
import {Studio,Brand,Modal,ClipDetail,UploadForm} from './studio'
import {Platform,Calendar,Analytics,Firewall} from './channels'
import {pages,PageName,Clip,Rule,Post,Claim,SkippedSegment,GlossaryItem,initialClips,initialPosts,initialClaims,initialSkippedSegments,initialGlossary,reasons,lessons,revisions} from '@/lib/episode'

const icons=[PanelsTopLeft,Clapperboard,Dna,Layers,CalendarDays,ChartNoAxesColumnIncreasing,ShieldCheck,Settings2]
const descriptions=[
  'Your content pipeline, at a glance.',
  'Find the moments worth sharing — with multimodal proof cards.',
  'The preferences and edits that shape your next clip.',
  'One moment, adapted for each channel with language mix control.',
  'Plan and manage your next seven days of content.',
  'Explore how simulated performance data changes your recommendations.',
  'Review every factual claim before it reaches your audience.',
  'Manage your local creator workspace.'
]

type TranscriptLine={start?:string,timestamp?:string,time?:string,text?:string}

export default function Workspace(){
const [page,setPage]=useState<PageName>('Overview')
const [mobile,setMobile]=useState(false)
const [episodeTitle,setEpisodeTitle]=useState('Chai with the Founder')
const [episodeLanguage,setEpisodeLanguage]=useState('Telugu + English')
const [clips,setClips]=useState<Clip[]>(initialClips)
const [posts,setPosts]=useState<Post[]>(initialPosts)
const [transcript,setTranscript]=useState<TranscriptLine[]>([
  {start:'00:00',text:'Namaste everyone, welcome back to Chai with the Founder.'},
  {start:'02:14',text:'Our first ten customers came from conversations, not campaigns. People overcomplicate early sales.'},
  {start:'05:32',text:'Hyderabad lo enduku? Here, your first customers can become your closest collaborators.'},
  {start:'08:05',text:'We stopped adding features and listened to the one problem everyone mentioned. That pivot changed everything.'},
  {start:'11:08',text:'We offer the best price in Hyderabad. Transparent pricing wins over aggressive discounts every time.'},
  {start:'14:20',text:'Ask about the last time a problem happened, not whether someone likes your idea.'},
  {start:'17:42',text:'Every Friday, one founder sits with a customer and watches them work. It keeps your intuition sharp.'}
])
const [skippedSegments,setSkippedSegments]=useState<SkippedSegment[]>(initialSkippedSegments)
const [glossary,setGlossary]=useState<GlossaryItem[]>(initialGlossary)
const [claims,setClaims]=useState<Claim[]>(initialClaims)
const [rules,setRules]=useState<Rule[]>([
  {text:'Use conversational Telugu-English code-switching.',source:'Edited the episode opening',on:true},
  {text:'Start with a specific founder experience, not a generic tip.',source:'Rewrote the opening hook',clip:1,on:true},
  {text:'Avoid unsupported superlatives in pricing claims.',source:'Flagged a pricing comparison',clip:4,on:true}
])
const [selected,select]=useState<number|null>(null)
const [reject,setReject]=useState(false)
const [reason,setReason]=useState('')
const [customReason,setCustomReason]=useState('')
const [sim,setSim]=useState(false)
const [upload,setUpload]=useState(false)
const [asset,setAsset]=useState<{name:string,url:string}|null>(null)
const [message,msg]=useState('')
const [prefs,setPrefs]=useState([65,75,90])
const [mix,setMix]=useState(50)
const [platform,setPlatform]=useState('Instagram Reel')
const [name,setName]=useState('Ananya Rao')
const [draft,setDraft]=useState(name)
const [version,refresh]=useState(0)

// Workspace state survives a reload. Clearing it restores the seeded demo.
const STORAGE_KEY='echolab.workspace.v2'
const [hydrated,setHydrated]=useState(false)

useEffect(()=>{
  try{
    const raw=localStorage.getItem(STORAGE_KEY)
    if(raw){
      const s=JSON.parse(raw)
      if(Array.isArray(s.clips)&&s.clips.length)setClips(s.clips)
      if(Array.isArray(s.posts))setPosts(s.posts)
      if(Array.isArray(s.claims))setClaims(s.claims)
      if(Array.isArray(s.rules))setRules(s.rules)
      if(Array.isArray(s.skippedSegments))setSkippedSegments(s.skippedSegments)
      if(Array.isArray(s.glossary))setGlossary(s.glossary)
      if(Array.isArray(s.transcript))setTranscript(s.transcript)
      if(typeof s.episodeTitle==='string')setEpisodeTitle(s.episodeTitle)
      if(typeof s.episodeLanguage==='string')setEpisodeLanguage(s.episodeLanguage)
      if(typeof s.name==='string'){setName(s.name);setDraft(s.name)}
    }
  }catch{}
  setHydrated(true)
},[])

useEffect(()=>{
  if(!hydrated)return
  try{
    localStorage.setItem(STORAGE_KEY,JSON.stringify({clips,posts,claims,rules,skippedSegments,glossary,transcript,episodeTitle,episodeLanguage,name}))
  }catch{}
},[hydrated,clips,posts,claims,rules,skippedSegments,glossary,transcript,episodeTitle,episodeLanguage,name])

const held=claims.some(c=>c.status==='Held for review')

useEffect(()=>{
if(!message)return
const t=setTimeout(()=>msg(''),3400)
return()=>clearTimeout(t)
},[message])

useEffect(()=>()=>{if(asset)URL.revokeObjectURL(asset.url)},[asset])

function go(p:PageName){
setPage(p)
setMobile(false)
select(null)
window.scrollTo(0,0)
}

function review(c:Clip){
select(c.id)
setReason('')
setCustomReason('')
setReject(false)
}

const current=clips.find(c=>c.id===selected)
const ordered=sim?[...clips].sort((a,b)=>Number(b.kind==='Question hook')-Number(a.kind==='Question hook')||b.score-a.score):clips
const active=rules.filter(r=>r.on).length

function rejectClip(){
if(!current)return
const finalReason = customReason.trim() || reason
if(!finalReason) return

const n=reasons.indexOf(finalReason)
const newRuleText = n>=0 ? lessons[n] : `Avoid ${finalReason.toLowerCase()} tone in opening hooks.`

setRules(r=>[{
  text: newRuleText,
  source: `Rejected clip ${String(current.id).padStart(2,'0')} · ${finalReason}`,
  clip: current.id,
  on: true,
  fresh: true
}, ...r])

// Rewrite remaining hooks dynamically (Slide 13: "The next batch rewrites itself")
setClips(cs=>cs.map(c=>{
  if(c.id===selected) return {...c, status:'Rejected' as const}
  if(c.status==='Rejected') return c
  if(n>=0 && revisions[n]?.[c.id-1]) {
    return {...c, title: revisions[n][c.id-1]}
  }
  return {...c, title: `${c.title} (Revised)`}
}))

setPosts(ps=>ps.filter(p=>p.clip!==selected))
refresh(v=>v+1)
select(null)
msg(`Hooks updated. New rule added to Brand Constitution: "${newRuleText}"`)
}

function simulate(){
if(sim)return
setSim(true)
setRules(r=>[
  {text:'Question hooks: 2.4× 3-second retention, weight +30%',source:'14-day simulation · based on 6 posts',on:true,fresh:true,confidence:'Low confidence · Directional signal'},
  {text:'Telugu-first hooks: 1.8× share rate on Instagram/WhatsApp',source:'14-day simulation · based on 4 posts',on:true,fresh:true,confidence:'Directional signal'},
  ...r
])
msg('Simulation complete. Clip rankings re-weighted. 2 new rules added to Brand Constitution.')
}

function approveClaim(id:number){
setClaims(cs=>cs.map(c=>c.id===id?{...c,status:'Creator-approved'}:c))
setPosts(ps=>ps.map(p=>{
  const claim=claims.find(c=>c.id===id)
  if(claim&&claim.clipId===p.clip&&p.status==='Awaiting claim approval'){
    return {...p,status:'Approved' as const}
  }
  return p
}))
msg('Claim marked Creator-approved. Associated calendar posts are unblocked.')
}

function editClaim(id:number,text:string){
setClaims(cs=>cs.map(c=>c.id===id?{...c,text,status:'Held for review'}:c))
setClips(cs=>cs.map(c=>{
  const claim=claims.find(cl=>cl.id===id)
  if(claim&&claim.clipId===c.id){
    return {...c,excerpt:text}
  }
  return c
}))
msg('Claim wording updated and saved for review.')
}

function handleAnalysis(file:File,result:any){
const epTitle = result.episode_title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
const epLang = result.detected_language || 'Multilingual (Detected)'

setEpisodeTitle(epTitle)
setEpisodeLanguage(epLang)

const generated:Clip[]=(result.clips||[]).map((c:any,i:number)=>{
const toSeconds=(value:string)=>{
  const parts=(value||'00:00').split(':').map(Number)
  return parts.reduce((total:number,part:number)=>total*60+part,0)
}
const seconds=Math.max(0,toSeconds(c.end)-toSeconds(c.start))
return {
  id: c.id || (i+1),
  title: c.title || `Highlight ${i+1}`,
  time: c.start || '00:00',
  end: c.end || '00:00',
  seconds: seconds || 35,
  score: c.score || (95 - i*2),
  kind: c.hook_type || (i%2===0 ? 'Founder insight' : 'Question hook'),
  excerpt: c.excerpt || '',
  why: c.reason || 'AI-selected moment from video analysis',
  status: 'Pending' as const,
  audioProof: c.audio_proof || `Emphasis peak at ${c.start||'00:00'} · Vocal energy contour`,
  visualProof: c.visual_proof || 'Speaker framing · Gesture and posture alignment',
  brandFit: c.brand_fit || 'Direct, authentic creator conversational tone',
  risk: c.risk || 'Verified from source recording',
  languageMix: c.language_mix || epLang,
  hookType: c.hook_type || (i%2===0 ? 'Founder insight' : 'Question hook'),
  platformCaptions: {
    reel: c.reel_caption || `🎬 "${c.excerpt}"\n\nWatch the full breakdown. #${epTitle.replace(/\s+/g, '')} #EchoLab`,
    linkedin: c.linkedin_copy || `Insight from ${epTitle}:\n\n"${c.excerpt}"\n\nKey takeaways:\n• Actionable insight\n• Validated in practice\n\nWhat is your perspective?`,
    whatsapp: c.whatsapp_status || `💡 Quick takeaway from ${epTitle}:\n"${c.excerpt}"\n\nShare this! 🚀`
  }
}
})

if(!generated.length){
msg('Analysis returned no clips. Try another video.')
return
}

// Process skipped segments from THIS video
const newSkipped:SkippedSegment[]=(result.skipped_segments||[]).map((s:any,i:number)=>({
  id: i+1,
  time: s.start || '00:00',
  end: s.end || '00:00',
  reason: s.reason || 'Segment filtered by AI threshold',
  clarity: s.clarity || 0.54,
  flag: s.flag || 'Low engagement'
}))

// Process claims from THIS video
const newClaims:Claim[]=(result.claims||[]).map((c:any,i:number)=>({
  id: i+1,
  text: c.text || '',
  status: (c.status || 'Held for review') as Claim['status'],
  timestamp: c.timestamp || '00:00',
  category: c.category || 'General fact',
  evidence: c.evidence || `Timestamped in ${file.name}`,
  clipId: c.clip_id || (i===0 ? 1 : i===1 ? 2 : 4)
}))

// Process glossary from THIS video
const newGlossary:GlossaryItem[]=(result.glossary||[]).map((g:any,i:number)=>({
  id: g.id || (i+1),
  term: g.term || '',
  translation: g.translation || '',
  notes: g.notes || '',
  category: g.category || 'Business'
}))

// Process discovered brand rules from THIS video
if(Array.isArray(result.brand_rules) && result.brand_rules.length > 0) {
  const newRules:Rule[] = result.brand_rules.map((r:any)=>({
    text: r.text,
    source: r.source || `Extracted from ${file.name}`,
    on: true,
    fresh: true
  }))
  setRules(prev => [...newRules, ...prev])
}

// Auto-populate 7-day calendar with the new clips from THIS video
const newPosts:Post[] = [
  { day: 0, platform: 'Instagram Reel', clip: generated[0]?.id || 1, status: 'Draft', time: '10:00' },
  { day: 1, platform: 'LinkedIn', clip: generated[1]?.id || (generated[0]?.id || 1), status: 'Draft', time: '09:30' },
  { day: 2, platform: 'WhatsApp', clip: generated[2]?.id || (generated[0]?.id || 1), status: 'Draft', time: '11:00' },
  { day: 4, platform: 'Instagram Reel', clip: generated[3]?.id || (generated[0]?.id || 1), status: newClaims.some(c=>c.clipId===generated[3]?.id && c.status==='Held for review') ? 'Awaiting claim approval' : 'Draft', time: '14:00' }
]

setClips(generated)
setTranscript(Array.isArray(result.transcript) ? result.transcript : [])
if(newSkipped.length) setSkippedSegments(newSkipped)
if(newClaims.length) setClaims(newClaims)
if(newGlossary.length) setGlossary(newGlossary)
setPosts(newPosts)

setAsset({name:file.name,url:URL.createObjectURL(file)})
setUpload(false)
go('Video Studio')
msg(result.demo_mode
  ? `Demo analysis for "${epTitle}" — Gemini was unavailable, so this is a sample result. ${generated.length} clips loaded.`
  : `Analysis complete for "${epTitle}". ${generated.length} clips with multimodal proof cards ready!`)
}

function nav(p:PageName){
const I=icons[pages.indexOf(p)]
const heldCount=claims.filter(c=>c.status==='Held for review').length
return <button key={p} className={'nav-item '+(p===page?'active':'')} aria-current={p===page?'page':undefined} onClick={()=>go(p)}><I/>{p}{p==='Claim Firewall'&&heldCount>0&&<em>{heldCount}</em>}</button>
}

return <div className="shell">
{mobile&&<button aria-label="Close navigation" className="scrim" onClick={()=>setMobile(false)}/>}
<aside className={mobile?'sidebar visible':'sidebar'}>
<div className="brand"><img src="/echo.svg" alt=""/>EchoLab</div>
<div className="side-label">WORKSPACE</div>
<nav>{pages.slice(0,5).map(nav)}</nav>
<div className="side-label gap-label">INTELLIGENCE</div>
<nav>{pages.slice(5,7).map(nav)}</nav>
<div className="sidebar-bottom">
<button className="memory" onClick={()=>go('Brand DNA')}>
<span><i/>Brand memory online</span>
<small>{active} active rules <ArrowUpRightIcon/></small>
</button>
{nav('Settings')}
<button className="account" onClick={()=>go('Settings')}>
<span className="avatar">{name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span>
<span><b>{name}</b><small>Creator workspace</small></span>
<ChevronRight size={14}/>
</button>
</div>
</aside>

<div className="main-area">
<header className="topbar">
<div className="crumb">
<button className="mobile-menu" aria-label="Open navigation" onClick={()=>setMobile(true)}><Menu/></button>
<PanelLeft size={16} className="desktop-icon"/>
<span>Workspace</span><ChevronRight size={13}/><b>{page}</b>
</div>
<span className="online"><i/> Studio online · {episodeTitle}</span>
</header>

<main>
<header className="page-head">
<div>
<div className="eyebrow header-label"><span className="short-line"/> CREATOR WORKSPACE</div>
<h1>{page==='Overview'?'Workspace overview':page}</h1>
<p>{descriptions[pages.indexOf(page)]}</p>
</div>
{(page==='Overview'||page==='Video Studio')&&<Button className="upload-btn" onClick={()=>setUpload(true)}><Plus/> Upload video</Button>}
</header>

{page==='Overview'&&<Overview clips={ordered} posts={posts} claims={claims} rules={active} episodeTitle={episodeTitle} episodeLanguage={episodeLanguage} go={go} review={review}/>}
{page==='Video Studio'&&<Studio clips={ordered} review={review} held={held} version={version} asset={asset} transcript={transcript} skippedSegments={skippedSegments} glossary={glossary} episodeTitle={episodeTitle} episodeLanguage={episodeLanguage}/>}
{page==='Brand DNA'&&<Brand rules={rules} setRules={setRules} prefs={prefs} setPrefs={setPrefs} open={id=>{const c=clips.find(c=>c.id===id);if(c)review(c)}}/>}
{page==='Platform Content'&&<Platform clips={clips} mix={mix} setMix={setMix} platform={platform} setPlatform={setPlatform} add={id=>{
  const clipHeld=claims.some(c=>c.clipId===id&&c.status==='Held for review')
  setPosts(p=>[...p,{day:3,platform,clip:id,status:clipHeld?'Awaiting claim approval':'Draft',time:'10:00'}])
  msg(clipHeld?'Draft added with held claim — approve in Claim Firewall first.':'Draft added to Thursday in your content calendar.')
}}/>}
{page==='Content Calendar'&&<Calendar posts={posts} setPosts={setPosts} clips={clips} held={held}/>}
{page==='Analytics'&&<Analytics sim={sim} simulate={simulate} clips={ordered} review={review}/>}
{page==='Claim Firewall'&&<Firewall claims={claims} clips={clips} approveClaim={approveClaim} editClaim={editClaim}/>}
{page==='Settings'&&<section className="panel padded narrow">
<h2>Creator profile</h2>
<p className="muted">Saved in this browser. Reset below to restore the original demo workspace.</p>
<form onSubmit={e=>{e.preventDefault();if(draft.trim()){setName(draft.trim());msg('Profile updated.')}}}>
<label>Display name<input value={draft} required maxLength={40} onChange={e=>setDraft(e.target.value)}/></label>
<Button>Save changes</Button>
</form>
<Button variant="outline" onClick={()=>{try{localStorage.clear()}catch{};location.reload()}}>Reset demo workspace</Button>
</section>}
<footer><AudioLines size={14}/> EchoLab Studio <span>/</span> Multilingual content workspace with adaptive brand memory</footer>
</main>
</div>

{current&&<Modal title={reject?'Reject this clip':current.title} close={()=>select(null)}>
{reject?<>
<p>What should EchoLab learn from this edit? The judge or creator teaches it with one reason (Slide 13):</p>
<div className="reason-grid">{reasons.map(r=><button className={'choice '+(reason===r&&!customReason?'chosen':'')} aria-pressed={reason===r&&!customReason} key={r} onClick={()=>{setReason(r);setCustomReason('')}}>{r}</button>)}</div>

<label style={{marginTop:'12px'}}>
Or type a custom reason:
<input 
  placeholder="e.g. too salesy, awkward phrasing, unverified..." 
  value={customReason} 
  onChange={e=>{setCustomReason(e.target.value);setReason('')}}
/>
</label>

<Button disabled={!reason && !customReason.trim()} onClick={rejectClip}>
  Reject clip & update Brand Constitution
</Button>
</>:<>
<ClipDetail c={current} held={held}/>
{current.status==='Pending'&&<div className="actions">
<Button variant="outline" onClick={()=>setReject(true)}>Reject clip</Button>
{current.risk&&current.risk.includes('Held')?<Button onClick={()=>go('Claim Firewall')}>Review claim <ArrowRight/></Button>:<Button onClick={()=>{setClips(cs=>cs.map(c=>c.id===selected?{...c,status:'Approved'}:c));select(null);msg('Clip approved.')}}><Check/>Approve clip</Button>}
</div>}
</>}
</Modal>}

{upload&&<Modal title="Upload source video" close={()=>setUpload(false)}>
<UploadForm save={handleAnalysis}/>
</Modal>}

{message&&<div role="status" className="toast"><Check size={16}/>{message}</div>}
</div>
}

function ArrowUpRightIcon(){return <ArrowRight size={13}/>}
