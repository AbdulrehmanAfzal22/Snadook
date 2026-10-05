import {useEffect,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {Instagram,ArrowUpRight,ArrowLeft,ArrowRight,Play,Pause,Heart,MessageCircle,Layers} from 'lucide-react';
import {useQuery} from '../../hooks/useQuery';
import {getInstagramFeed,getMoreInstagramReels} from '../../services/instagramReels';
import {httpsMediaUrl,instagramUrl,reelShopDestination} from '../../lib/instagramMedia';
import Reveal from './Reveal';

function useReducedMotion(){
  const [reduced,setReduced]=useState(()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false);
  useEffect(()=>{const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');if(!media)return;const change=()=>setReduced(media.matches);media.addEventListener?.('change',change);return()=>media.removeEventListener?.('change',change);},[]);
  return reduced;
}

function ReelCard({reel,playbackAllowed}){
  const node=useRef(null),video=useRef(null),[visible,setVisible]=useState(false),[playing,setPlaying]=useState(false),[failed,setFailed]=useState(false),[imageFailed,setImageFailed]=useState(false),[avatarFailed,setAvatarFailed]=useState(false);
  const permalink=instagramUrl(reel.permalink||reel.instagram_url),poster=httpsMediaUrl(reel.thumbnail_url),source=httpsMediaUrl(reel.media_url),avatar=httpsMediaUrl(reel.profile_image),shop=reelShopDestination(reel);
  const isReel=reel.media_type==='VIDEO',isVideo=isReel&&source,isAlbum=reel.media_type==='CAROUSEL_ALBUM';
  const image=poster||(!isReel&&source),published=new Date(reel.published_at);
  const date=reel.published_at&&Number.isFinite(published.getTime())?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short'}).format(published):null;
  const count=value=>new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(value);
  useEffect(()=>{
    if(!isVideo||typeof IntersectionObserver==='undefined')return;
    const observer=new IntersectionObserver(entries=>setVisible(entries.some(entry=>entry.isIntersecting)),{threshold:0.55});
    if(node.current)observer.observe(node.current);return()=>observer.disconnect();
  },[isVideo]);
  useEffect(()=>{
    if(!video.current)return;
    if(playbackAllowed&&visible&&!failed){const result=video.current.play();result?.catch(()=>setPlaying(false));}
    else video.current.pause();
  },[playbackAllowed,visible,failed]);
  function togglePlayback(){
    if(!video.current)return;
    if(playing)video.current.pause();else video.current.play()?.catch(()=>setFailed(true));
  }
  if(!permalink)return null;
  return <article ref={node} className="sf-reel-card">
    <a className="sf-reel-author" href={permalink} target="_blank" rel="noopener noreferrer"><span className="sf-reel-avatar">{avatar&&!avatarFailed?<img src={avatar} alt="" loading="lazy" onError={()=>setAvatarFailed(true)}/>:<Instagram size={15}/>}</span><span className="sf-reel-identity"><strong>{reel.username?'@'+reel.username:'On Instagram'}</strong><small>{isReel?'Reel':isAlbum?'Photo collection':'Post'}{date?' · '+date:''}</small></span><Instagram size={14}/></a>
    <p className="sf-reel-card-caption">{reel.caption||'See this moment on Instagram.'}</p>
    <div className="sf-reel-media">
    {isVideo&&!failed?<video ref={video} src={source} poster={poster||undefined} muted playsInline loop preload="none" aria-label={reel.caption||'Instagram Reel'} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setFailed(true)}/>:image&&!imageFailed?<img src={image} alt={reel.caption?reel.caption.slice(0,140):'A moment from the store on Instagram'} loading="lazy" onError={()=>setImageFailed(true)}/>:<a className="sf-reel-no-image" href={permalink} target="_blank" rel="noopener noreferrer"><Instagram size={30}/><span>See this moment on Instagram <ArrowUpRight size={13}/></span></a>}
    <span className="sf-reel-tag">{isAlbum?<Layers size={12}/>:<Instagram size={12}/>} {isReel?'REEL':isAlbum?'PHOTO SET':'POST'}</span>
    {isVideo&&!failed&&<button type="button" className="sf-reel-play" aria-label={playing?'Pause this Reel':'Play this Reel'} onClick={togglePlayback}>{playing?<Pause size={19}/>:<Play size={19}/>}</button>}
  </div><div className="sf-reel-meta"><div className="sf-reel-stats">{Number.isFinite(reel.like_count)&&<span aria-label={reel.like_count.toLocaleString()+' likes'}><Heart size={13}/>{count(reel.like_count)}</span>}{Number.isFinite(reel.comment_count)&&<span aria-label={reel.comment_count.toLocaleString()+' comments'}><MessageCircle size={13}/>{count(reel.comment_count)}</span>}</div><a className="sf-reel-open" href={permalink} target="_blank" rel="noopener noreferrer" aria-label={'Open Instagram '+(isReel?'Reel':'post')+(reel.username?' by @'+reel.username:'')}>{isReel?'Watch Reel':'View Post'} <ArrowUpRight size={13}/></a></div>
  {shop&&(shop.startsWith('/')?<Link className="sf-reel-shop" to={shop}>Shop this moment <ArrowUpRight size={15}/></Link>:<a className="sf-reel-shop" href={shop} target="_blank" rel="noopener noreferrer">Shop this moment <ArrowUpRight size={15}/></a>)}</article>;
}

export default function ShoeReels(){
  const query=useQuery(getInstagramFeed,[]),track=useRef(null),section=useRef(null),reduced=useReducedMotion();
  const [paused,setPaused]=useState(false),[hovered,setHovered]=useState(false),[visible,setVisible]=useState(false),[more,setMore]=useState([]),[nextOffset,setNextOffset]=useState(null),[loadingMore,setLoadingMore]=useState(false),[moreError,setMoreError]=useState(false),[pageVisible,setPageVisible]=useState(!document.hidden);
  useEffect(()=>{setMore([]);setNextOffset(query.data?.nextOffset??null);},[query.data]);
  useEffect(()=>{const change=()=>setPageVisible(!document.hidden);document.addEventListener('visibilitychange',change);return()=>document.removeEventListener('visibilitychange',change);},[]);
  useEffect(()=>{
    if(typeof IntersectionObserver==='undefined')return;
    const observer=new IntersectionObserver(entries=>setVisible(entries.some(entry=>entry.isIntersecting)),{threshold:0.15});
    if(section.current)observer.observe(section.current);return()=>observer.disconnect();
  },[]);
  const settings=query.data?.settings||{},items=[...(query.data?.reels||[]),...more].filter((item,index,all)=>instagramUrl(item.permalink||item.instagram_url)&&all.findIndex(other=>other.media_id===item.media_id)===index);
  const autoplay=Boolean(settings.autoplay_enabled)&&!paused&&!reduced&&visible&&pageVisible;
  function step(direction){
    const element=track.current;if(!element)return;
    const gap=parseFloat(window.getComputedStyle(element).columnGap)||18;
    const width=(element.firstElementChild?.getBoundingClientRect().width||250)+gap,max=Math.max(0,element.scrollWidth-element.clientWidth);
    const next=direction>0&&element.scrollLeft>=max-8?0:Math.max(0,Math.min(max,element.scrollLeft+direction*width));
    element.scrollTo?.({left:next,behavior:reduced?'instant':'smooth'});
  }
  function browseWithKeyboard(event){
    if(event.target!==event.currentTarget)return;
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();step(event.key==='ArrowRight'?1:-1);}
    else if(event.key==='Home'||event.key==='End'){event.preventDefault();const element=track.current;element?.scrollTo?.({left:event.key==='Home'?0:Math.max(0,element.scrollWidth-element.clientWidth),behavior:reduced?'instant':'smooth'});}
  }
  useEffect(()=>{
    if(!autoplay||hovered||items.length<2)return;
    const timer=window.setInterval(()=>step(1),Math.max(3,Math.min(10,settings.autoplay_interval_seconds||5))*1000);
    return()=>window.clearInterval(timer);
  },[autoplay,hovered,items.length,settings.autoplay_interval_seconds,reduced]);
  async function loadMore(){
    setLoadingMore(true);setMoreError(false);
    try{const result=await getMoreInstagramReels(nextOffset);setMore(current=>[...current,...result.reels]);setNextOffset(result.nextOffset);}
    catch{setMoreError(true);}finally{setLoadingMore(false);}
  }
  const profile=instagramUrl(settings.profile_url),hasItems=items.length>0&&!query.error;
  return <Reveal className="sf-section sf-reels-section" id="instagram"><div ref={section}>
    <div className="sf-section-head"><div><p className="sf-eyebrow">FROM OUR INSTAGRAM, WITH SOLE</p><h2>Worn & <em>loved.</em><span className="sf-ig-title-mark" aria-hidden="true"><Instagram size={20}/></span></h2></div>{profile&&settings.username&&<a className="sf-button sf-button-outline" href={profile} target="_blank" rel="noopener noreferrer"><Instagram size={15}/> View Instagram <ArrowUpRight size={17}/></a>}</div>
    <div className="sf-reels-intro"><p>Fresh drops, real details and everyday styling. Follow our latest Reels and posts.</p>{hasItems&&<div className="sf-reels-controls"><button type="button" aria-label={paused?'Resume automatic Reel playback':'Pause automatic Reel playback'} aria-pressed={paused} onClick={()=>setPaused(current=>!current)}>{paused?<Play size={16}/>:<Pause size={16}/>}</button><button type="button" aria-label="Previous Instagram moments" onClick={()=>step(-1)}><ArrowLeft size={18}/></button><button type="button" aria-label="Next Instagram moments" onClick={()=>step(1)}><ArrowRight size={18}/></button></div>}</div>
    {hasItems?<><div className="sf-reels-track" ref={track} role="region" tabIndex="0" onKeyDown={browseWithKeyboard} style={{'--ig-desktop':settings.desktop_cards||5,'--ig-mobile':settings.mobile_cards||1.2}} onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)} onFocusCapture={()=>setHovered(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setHovered(false);}} onTouchStart={()=>setPaused(true)} aria-label="Instagram Reels and posts">{items.map(reel=><ReelCard key={reel.media_id} reel={reel} playbackAllowed={autoplay}/>)}</div>{nextOffset!==null&&<div className="sf-reels-more"><button className="sf-text-link" disabled={loadingMore} onClick={loadMore}>{loadingMore?'Loading moments…':moreError?'Try loading more again':'More moments'} <ArrowRight size={17}/></button></div>}</>:<div className="sf-reels-waiting"><div className="sf-reels-waiting-art" aria-hidden="true"><div><img src="/images/catalog/canvas-low.jpg" alt="" loading="lazy"/><span>THE DAILY ROTATION</span></div><div><img src="/images/catalog/ivory-sneaker.jpg" alt="" loading="lazy"/><span>GOOD PAIRS. GOOD DAYS.</span></div><span className="sf-reels-art-spark">✳</span></div><div className="sf-reels-waiting-copy"><span className="sf-reels-coming"><span className="sf-dot"/> {query.loading?'FINDING OUR LATEST MOMENTS':'OUR NEXT STORY STARTS HERE'}</span><h3>See the sole.<br/><em>Feel the story.</em></h3><p>{query.error?'Our Instagram moments are taking a little break. Check back soon.':query.data?.connected?'New moments will appear here as the store publishes them on Instagram.':'Our Instagram Reels and posts will appear here once the store connects its account. Stay close for fresh drops and everyday inspiration.'}</p>{query.error?<button type="button" className="sf-text-link" onClick={query.refresh}>Try again <ArrowRight size={16}/></button>:<Link className="sf-text-link" to="/shop">Find your next rotation <ArrowUpRight size={17}/></Link>}</div></div>}
    <div className="sf-reels-footnote"><Instagram size={15}/><span>{hasItems?'FROM OUR INSTAGRAM TO YOUR EVERYDAY':'NEW STORIES ARE ON THEIR WAY'}</span><span aria-hidden="true">✳</span></div>
  </div></Reveal>;
}
