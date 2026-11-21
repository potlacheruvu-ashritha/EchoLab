import {ArrowRight,ArrowUpRight,AudioLines,CalendarDays,CheckCheck,ChevronRight,CircleCheck,Clapperboard,Clock3,Dna,Headphones,Languages,Layers3,Scissors,Sparkles,Camera as Instagram,BriefcaseBusiness,MessageCircle,Radio,ShieldCheck,ShieldAlert} from 'lucide-react'
import {Button} from './ui/button'
import {Clip,Claim,PageName,Post,days} from '@/lib/episode'

export function Wave({id}:{id:number}){return <span className={'wave w'+id} aria-hidden="true"><svg viewBox="0 0 78 50" fill="none">{Array.from({length:43},(_,i)=>{const t=i/42;const h=2+Math.abs(Math.sin(i*2.7+id)*Math.sin(t*Math.PI)*Math.cos(t*4+id))*37;return <line key={i} x1={i*1.8+1} x2={i*1.8+1} y1={(25-h/2).toFixed(2)} y2={(25+h/2).toFixed(2)} stroke="currentColor" strokeWidth="1.2"/>})}</svg></span>}

export function Pill({children,tone='green'}:{children:React.ReactNode,tone?:string}){return <span className={'pill '+tone}>{children}</span>}

export function Overview({clips,posts,claims,rules,episodeTitle='Chai with the Founder',episodeLanguage='Telugu + English',go,review}:{clips:Clip[],posts:Post[],claims:Claim[],rules:number,episodeTitle?:string,episodeLanguage?:string,go:(p:PageName)=>void,review:(c:Clip)=>void}){
  const heldClaims=claims.filter(c=>c.status==='Held for review').length

  const cards=[
    {icon:Scissors,n:clips.filter(c=>c.status!=='Rejected').length,label:'Clips generated',foot:'With multimodal proof cards',page:'Video Studio'},
    {icon:Clock3,n:clips.filter(c=>c.status==='Pending').length,label:'Pending review',foot:'Ready for your approval',page:'Video Studio'},
    {icon:Dna,n:rules,label:'Brand DNA rules',foot:'Active in your workspace',page:'Brand DNA'},
    {icon:ShieldCheck,n:heldClaims,label:heldClaims===1?'Held claim':'Held claims',foot:heldClaims>0?'Requires creator decision':'All claims verified',page:'Claim Firewall'}
  ]

  return <>
    <section className="hero">
      <div className="hero-art"/>
      <div className="hero-copy">
        <div className="eyebrow light"><Radio size={15}/> ACTIVE EPISODE <span className="onair">PROCESSED</span></div>
        <h2>{episodeTitle}</h2>
        <div className="metadata">
          <span><Headphones/>Source recording</span>
          <i/>
          <span><Clock3/>Multimodal AI</span>
          <i/>
          <span><Languages/>{episodeLanguage}</span>
        </div>
        <Button onClick={()=>go('Video Studio')} className="studio-btn">Open Video Studio <ArrowUpRight/></Button>
      </div>
      <span className="art-index">FIG. 01 &nbsp; / &nbsp; ECHOLAB PIPELINE</span>
    </section>

    <div className="statgrid">{cards.map(({icon:I,n,label,foot,page},i)=><button className="stat panel" key={label} onClick={()=>go(page as PageName)}>
      <div className="stat-top"><span className={'iconbox tone'+i}><I size={18}/></span><ArrowUpRight size={14}/></div>
      <div className="stat-number">{String(n).padStart(2,'0')}</div>
      <b>{label}</b><small>{foot}</small>
    </button>)}</div>

    <div className="dashboard-grid">
      <section className="panel">
        <header className="panel-head">
          <div className="eyebrow"><Sparkles/> AI SELECTION</div>
          <div className="row"><h2>Top clip candidates</h2><button className="link" onClick={()=>go('Video Studio')}>View all <ArrowRight/></button></div>
        </header>
        <div className="list">{clips.filter(c=>c.status!=='Rejected').slice(0,3).map(c=><button className="clip-row reveal" key={c.id+c.title} onClick={()=>review(c)}>
          <Wave id={c.id}/>
          <div className="grow">
            <h3>{c.title}</h3>
            <div className="clip-meta"><span>{c.time} – {c.end}</span><span>·</span>{c.seconds}s</div>
            <span className="type-tag">{c.kind}</span>
          </div>
          <div className="score"><strong>{c.score}%</strong><small>confidence</small></div>
        </button>)}</div>
      </section>

      <section className="panel">
        <header className="panel-head">
          <div className="eyebrow"><CalendarDays/> PUBLISHING</div>
          <div className="row"><h2>Up next</h2><button className="link" onClick={()=>go('Content Calendar')}>Calendar <ArrowRight/></button></div>
        </header>
        <div className="list">{[...posts].sort((a,b)=>a.day-b.day||a.time.localeCompare(b.time)).slice(0,3).map((p,i)=>{
          const I=p.platform==='LinkedIn'?BriefcaseBusiness:p.platform==='WhatsApp'?MessageCircle:Instagram
          return <button className="post-row" key={i} onClick={()=>go('Content Calendar')}>
            <span className="datebox"><small>{days[p.day]}</small><b>{23+p.day}</b></span>
            <div className="grow">
              <div className="channel"><I size={13}/>{p.platform}</div>
              <h3>{clips.find(c=>c.id===p.clip)?.title || `Clip ${p.clip}`}</h3>
              <div className="post-meta">{p.time}<span>·</span><span className={'status s'+p.status.split(' ')[0]}>{p.status}</span></div>
            </div>
          </button>
        })}</div>
      </section>
    </div>
  </>
}
