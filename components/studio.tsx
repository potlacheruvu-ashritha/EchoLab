import {useRef,useEffect,useState,Dispatch,SetStateAction} from 'react'
import {Button} from './ui/button'
import {Wave,Pill} from './overview'
import {Clip,Rule,SkippedSegment,GlossaryItem} from '@/lib/episode'
import {API_BASE} from '@/lib/api'
import {X,ArrowUpRight,ShieldAlert,Headphones,Check,Dna,Upload,Volume2,Eye,Sparkles,AlertTriangle,Languages,BookOpen,Sparkle} from 'lucide-react'

type TranscriptLine = {
  start?:string
  timestamp?:string
  time?:string
  text?:string
}

export function Modal({title,close,children}:{title:string,close:()=>void,children:React.ReactNode}){
  const ref=useRef<HTMLDialogElement>(null)
  useEffect(()=>{
    ref.current?.showModal()
    const old=document.body.style.overflow
    document.body.style.overflow='hidden'
    return()=>{
      document.body.style.overflow=old
    }
  },[])
  return <dialog ref={ref} aria-labelledby="dialog-title" onCancel={close} onClick={e=>{if(e.target===ref.current)close()}}>
    <div className="modal-body">
      <div className="row"><h2 id="dialog-title">{title}</h2><button aria-label="Close dialog" onClick={close}><X size={19}/></button></div>
      {children}
    </div>
  </dialog>
}

export function ClipDetail({c,held}:{c:Clip,held:boolean}){
  return <>
    <div className="actions"><Pill>{c.status}</Pill><span className="clip-meta">{c.time} – {c.end} · {c.seconds}s</span>{c.hookType&&<Pill tone="amber">{c.hookType}</Pill>}</div>
    <blockquote>"{c.excerpt}"</blockquote>

    {/* Multimodal Proof Cards */}
    {(c.audioProof||c.visualProof)&&<div className="proof-grid">
      {c.audioProof&&<div className="proof-card">
        <div className="proof-header"><Volume2 size={14}/><span>Audio proof</span></div>
        <p>{c.audioProof}</p>
      </div>}
      {c.visualProof&&<div className="proof-card">
        <div className="proof-header"><Eye size={14}/><span>Visual proof</span></div>
        <p>{c.visualProof}</p>
      </div>}
      {c.brandFit&&<div className="proof-card">
        <div className="proof-header"><Sparkles size={14}/><span>Brand fit</span></div>
        <p>{c.brandFit}</p>
      </div>}
      {c.risk&&<div className="proof-card">
        <div className="proof-header"><AlertTriangle size={14}/><span>Risk check</span></div>
        <p>{c.risk}</p>
      </div>}
    </div>}

    {c.languageMix&&<div className="language-bar">
      <Languages size={13}/><span>{c.languageMix}</span>
    </div>}

    <div className="eyebrow">SELECTION REASON</div>
    <p>{c.why}</p>
    <small className="score-text">{c.score>0?`${c.score}% confidence · `:''}{c.kind}</small>
    {c.risk&&c.risk.includes('Held')&&<p className="warning"><ShieldAlert size={16}/> Claim held for review — requires creator approval before publishing</p>}
  </>
}

export function Studio({clips,review,held,version,asset,transcript=[],skippedSegments=[],glossary=[],episodeTitle='Chai with the Founder',episodeLanguage='Telugu + English'}:{clips:Clip[],review:(c:Clip)=>void,held:boolean,version:number,asset:{name:string,url:string}|null,transcript?:TranscriptLine[],skippedSegments?:SkippedSegment[],glossary?:GlossaryItem[],episodeTitle?:string,episodeLanguage?:string}){
  const [tab,setTab]=useState('Clip candidates')
  const tabList = ['Clip candidates','Transcript','Skipped segments','Glossary']

  return <>
    {asset&&<section className="panel padded">
      <div className="eyebrow">LOCAL SOURCE PREVIEW</div>
      <h2>{asset.name}</h2>
      <video controls src={asset.url} className="media-preview"/>
      <p className="muted">Your uploaded source video. Clips and proof cards are extracted directly from this recording.</p>
    </section>}

    <div className="mini-hero">
      <div className="eyebrow light"><Headphones size={15}/> SOURCE EPISODE</div>
      <h2>{asset?.name || episodeTitle}</h2>
      <span>{asset ? `AI-analyzed recording · ${episodeLanguage}` : '20:00 / Telugu + English · Multilingual creator workspace'}</span>
    </div>

    <div className="tabs">
      {tabList.map(t=><button key={t} className={tab===t?'selected':''} onClick={()=>setTab(t)}>{t}{t==='Skipped segments'&&skippedSegments.length>0&&<em className="tab-badge">{skippedSegments.length}</em>}</button>)}
    </div>

    {tab==='Clip candidates'?
      <div key={version} className="studio-grid reveal">
        {clips.filter(c=>c.status!=='Rejected').map(c=><article className="panel padded" key={c.id}>
          <div className="row"><Wave id={c.id}/><span className="eyebrow">CLIP {String(c.id).padStart(2,'0')}</span>{c.hookType&&<Pill tone="amber">{c.hookType}</Pill>}</div>
          <h2>{c.title}</h2>
          <div className="actions"><Pill>{c.status}</Pill><span className="clip-meta">{c.time} – {c.end} · {c.seconds}s</span></div>
          <blockquote>"{c.excerpt}"</blockquote>

          {/* Inline multimodal proof indicators */}
          {c.audioProof&&<div className="proof-inline"><Volume2 size={12}/><small>{c.audioProof}</small></div>}
          {c.visualProof&&<div className="proof-inline"><Eye size={12}/><small>{c.visualProof}</small></div>}
          {c.languageMix&&<div className="proof-inline"><Languages size={12}/><small>{c.languageMix}</small></div>}
          {c.risk&&c.risk.includes('Held')&&<p className="warning"><ShieldAlert size={14}/> {c.risk}</p>}

          <small className="score-text">{c.score>0?`${c.score}% confidence · `:''}{c.kind}</small>
          <Button variant="outline" onClick={()=>review(c)}>{c.status==='Pending'?'Review clip':'View clip'} <ArrowUpRight/></Button>
        </article>)}
        {clips.filter(c=>c.status!=='Rejected').length===0&&<p>No clips found yet. Upload a video to get started.</p>}
      </div>:

    tab==='Transcript'?
      <section className="panel padded">
        <h2>Full video transcript</h2>
        <p className="muted">Timestamped spoken words generated from this video.</p>
        {transcript.length>0?
          transcript.map((line,i)=><p className="transcript" key={i}>
            <b>{line.start||line.timestamp||line.time||''}</b> {line.text||''}
          </p>):
          <p className="muted">No transcript available. Upload a video to transcribe.</p>
        }
      </section>:

    tab==='Skipped segments'?
      <section className="panel padded">
        <div className="eyebrow"><AlertTriangle size={14}/> FILTERED SEGMENTS</div>
        <h2>Skipped segments</h2>
        <p className="muted">Rejections are shown so you see what was left out and why. Filtered based on speech clarity and hook engagement thresholds.</p>
        {skippedSegments.length>0?
          skippedSegments.map(seg=><div key={seg.id} className="skipped-row">
            <div className="row">
              <span className="clip-meta">{seg.time} – {seg.end}</span>
              <Pill tone={seg.flag==='Low clarity'?'amber':seg.flag==='Off-topic'?'amber':'green'}>{seg.flag}</Pill>
            </div>
            <p>{seg.reason}</p>
            <div className="clarity-bar">
              <small>Speech clarity</small>
              <div className="clarity-track"><div className="clarity-fill" style={{width:`${Math.round(seg.clarity*100)}%`}}/></div>
              <small>{Math.round(seg.clarity*100)}%</small>
            </div>
          </div>):
          <p className="muted">No segments were skipped for this video.</p>
        }
      </section>:

      <section className="panel padded">
        <div className="eyebrow"><BookOpen size={14}/> REGIONAL GLOSSARY</div>
        <h2>Multilingual terms & proper nouns</h2>
        <p className="muted">Key terms, proper names, and code-switched phrases extracted from this video. Ensures captions and subtitles don't break on regional terminology.</p>
        {glossary.length>0?
          glossary.map(g=><div key={g.id} className="rule-row">
            <div className="grow">
              <Pill tone={g.category==='Slang'?'amber':'green'}>{g.category}</Pill>
              <h3>{g.term}</h3>
              <small>{g.translation}</small>
              <p className="muted" style={{fontSize:'12px',marginTop:'4px'}}>{g.notes}</p>
            </div>
          </div>):
          <p className="muted">No glossary terms found yet.</p>
        }
      </section>
    }
  </>
}

export function Brand({rules,setRules,prefs,setPrefs,open}:{rules:Rule[],setRules:Dispatch<SetStateAction<Rule[]>>,prefs:number[],setPrefs:(v:number[])=>void,open:(id:number)=>void}){
  const [editing,setEditing]=useState<number|null>(null)
  const [text,setText]=useState('')
  const [pastPosts,setPastPosts]=useState('')
  const [seeding,setSeeding]=useState(false)
  const [seedResult,setSeedResult]=useState<{tone:string,favs:string,avoid:string}|null>(null)

  function runSeed(){
    setSeeding(true)
    setTimeout(()=>{
      setSeedResult({
        tone: 'Conversational, authentic Hyderabad founder perspective',
        favs: 'real conversations, Hyderabad lo, validate early, unscalable',
        avoid: 'synergy, best-in-class, disruptive, guaranteed ROI'
      })
      setRules(rs=>[
        {text:'Focus on personal founder lessons rather than marketing jargon.',source:'Brand DNA Seed · Extracted from past posts',on:true,fresh:true},
        {text:'Preserve conversational Telugu-English phrasing without over-translating.',source:'Brand DNA Seed · Past post tone profile',on:true,fresh:true},
        ...rs
      ])
      setSeeding(false)
    }, 600)
  }

  return <>
    {/* Brand DNA Seed: No Cold Start (Slide 9) */}
    <section className="panel padded" style={{marginBottom:'18px'}}>
      <div className="eyebrow"><Sparkle size={14}/> BRAND DNA SEED: NO COLD START</div>
      <h2>Seed your brand memory on day one</h2>
      <p className="muted">Upload or paste 2-3 previous captions or statuses. EchoLab extracts your tone, favorite phrases, and words to avoid — so your very first batch of clips sounds like you.</p>
      
      <label>
        Paste past captions or post excerpts:
        <textarea 
          placeholder="Paste 1-3 previous social posts or captions here..." 
          value={pastPosts} 
          onChange={e=>setPastPosts(e.target.value)}
        />
      </label>
      
      <div className="actions">
        <Button disabled={seeding} onClick={runSeed}>
          {seeding ? 'Extracting style profile...' : 'Extract brand voice & seed rules'}
        </Button>
        <Button variant="outline" onClick={()=>setPastPosts("Talked with 10 early users today over chai in HITEC City. Build with real people, not assumptions. Transparent pricing wins every single time.")}>
          Load sample creator posts
        </Button>
      </div>

      {seedResult&&<div className="proof-grid reveal" style={{marginTop:'14px'}}>
        <div className="proof-card">
          <div className="proof-header"><Sparkles size={14}/><span>Extracted tone</span></div>
          <p>{seedResult.tone}</p>
        </div>
        <div className="proof-card">
          <div className="proof-header"><Check size={14}/><span>Favorite phrases</span></div>
          <p>{seedResult.favs}</p>
        </div>
        <div className="proof-card">
          <div className="proof-header"><AlertTriangle size={14}/><span>Words to avoid</span></div>
          <p>{seedResult.avoid}</p>
        </div>
        <div className="proof-card">
          <div className="proof-header"><Dna size={14}/><span>Rules generated</span></div>
          <p>2 seed rules added to Brand Constitution below</p>
        </div>
      </div>}
    </section>

    {/* Three Sliders (Slide 9) */}
    <div className="prefgrid">
      {['Tone','Framing','Fact strictness'].map((s,i)=><div key={s} className="panel padded">
        <div className="row"><h2>{s}</h2><Pill>{prefs[i]}%</Pill></div>
        <input aria-label={s} type="range" value={prefs[i]} onChange={e=>setPrefs(prefs.map((x,j)=>i===j?+e.target.value:x))}/>
        <div className="range-label">
          <span>{['Formal','Sales-focused','Standard / Flexible'][i]}</span>
          <span>{['Street-smart (Conversational)','Storytelling','Fact-lock strict'][i]}</span>
        </div>
      </div>)}
    </div>

    {/* Brand Constitution Rules (Slide 11) */}
    <section className="panel padded">
      <div className="eyebrow"><Dna size={14}/> BRAND CONSTITUTION</div>
      <div className="row"><h2>Rules learned from your edits</h2><Pill>{rules.filter(r=>r.on).length} active</Pill></div>
      <p className="muted" style={{margin:'6px 0 14px'}}>Every rejection, hook edit, and simulation signal becomes an explicit rule in your Brand Constitution.</p>
      
      {rules.map((r,i)=><div key={i} className="rule-row">
        <div className="grow">
          {r.fresh&&<Pill>learned just now</Pill>}
          <h3>{r.text}</h3>
          {r.confidence&&<small className="muted" style={{display:'block'}}>{r.confidence}</small>}
          {r.clip?<button className="link" onClick={()=>open(r.clip!)}>{r.source} <ArrowUpRight/></button>:<small>{r.source}</small>}
        </div>
        <button className="link" onClick={()=>{setEditing(i);setText(r.text)}}>Edit</button>
        <button role="switch" aria-label={r.text} aria-checked={r.on} className={'switch '+(r.on?'enabled':'')} onClick={()=>setRules(rs=>rs.map((x,j)=>j===i?{...x,on:!x.on}:x))}><i/></button>
      </div>)}
    </section>

    {editing!==null&&<Modal title="Edit brand rule" close={()=>setEditing(null)}>
      <label>Rule<textarea value={text} onChange={e=>setText(e.target.value)}/></label>
      <Button disabled={!text.trim()} onClick={()=>{setRules(rs=>rs.map((r,i)=>i===editing?{...r,text:text.trim()}:r));setEditing(null)}}>Save rule</Button>
    </Modal>}
  </>
}

export function UploadForm({save}:{save:(f:File,result:any)=>void}){
  const [file,setFile]=useState<File|null>(null)
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState('')
  const [progress,setProgress]=useState('')

  async function analyze(){
    if(!file)return
    setLoading(true)
    setError('')
    setProgress('Uploading video to EchoLab multimodal pipeline...')
    try{
      const data=new FormData()
      data.append('file',file)
      setProgress('Analyzing video audio, visual frames, speech, and claims...')
      const res=await fetch(`${API_BASE}/api/analyze`,{
        method:'POST',
        body:data
      })
      if(!res.ok){
        const detail=await res.text()
        throw new Error(detail||'Video analysis failed')
      }
      setProgress('Extracting clips, multimodal proof cards, and Claim Firewall evidence...')
      const result=await res.json()
      if(!Array.isArray(result.clips)){
        throw new Error('The AI response did not contain a clips list.')
      }
      save(file,result)
    }catch(err){
      setError(err instanceof Error?err.message:'Analysis failed')
    }finally{
      setLoading(false)
      setProgress('')
    }
  }

  return <>
    <p>Upload your video. EchoLab will process audio, visuals, and speech together to extract moments worth sharing — complete with multimodal proof cards, Claim Firewall flags, platform copy, and Brand DNA rules for THIS video.</p>
    <label className="upload-zone">
      <Upload/>
      {file?.name||'Choose a video file (.mp4, .mov, .webm)'}
      <input type="file" accept="video/*" hidden onChange={e=>setFile(e.target.files?.[0]??null)}/>
    </label>
    {file&&<p className="muted">{(file.size/1024/1024).toFixed(1)} MB selected · Ready to analyze</p>}
    <Button disabled={loading||!file} onClick={analyze}>
      {loading?'Analyzing full video with multimodal AI...':'Analyze with EchoLab'}
    </Button>
    {loading&&<>
      <p className="muted" style={{fontWeight:600,color:'var(--teal)'}}>{progress}</p>
      <p className="muted">Gemini processes the whole file, so expect 20–60 seconds for a short clip and several minutes for a long one. Keep this window open.</p>
    </>}
    {error&&<p className="warning">{error}</p>}
  </>
}
