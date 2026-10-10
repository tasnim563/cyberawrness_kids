"use client";
import { useState, useEffect } from "react";
import KidNav from "@/components/KidNav";
import { useChild } from "@/lib/childContext";
import { addQuizScore } from "@/lib/db";
import Link from "next/link";

const questions = [
  { q:"Un inconnu en ligne me demande de garder notre amitié secrète. C'est...", opts:["Normal c'est pour s'amuser","Un signal d'alarme — j'en parle à un adulte ! ✓","Sympa il veut être mon ami spécial","Rien d'important"], ans:1, emoji:"👤", theme:"Inconnus" },
  { q:"Lequel est le meilleur mot de passe ?", opts:["123456","monprenom2010","T!ger#42Lune ✓","azerty"], ans:2, emoji:"🔐", theme:"Mots de passe" },
  { q:"Je reçois 'Tu as gagné 1000€ ! Clique ici !'. Je dois...", opts:["Cliquer tout de suite !","Donner mon adresse","Ne pas cliquer et en parler à mes parents ✓","L'envoyer à mes amis"], ans:2, emoji:"⚠️", theme:"Navigation" },
  { q:"Le cyberharcèlement c'est quand...", opts:["On joue ensemble en ligne","Quelqu'un est méchant une fois par erreur","Quelqu'un est méchant de façon répétée en ligne ✓","On se dispute au jeu vidéo"], ans:2, emoji:"💪", theme:"Cyberharcèlement" },
  { q:"Pour créer un compte sur un site, je dois d'abord...", opts:["M'inscrire directement","Demander la permission à mes parents ✓","Donner mon vrai nom et adresse","Inventer un âge plus grand"], ans:1, emoji:"📝", theme:"Infos perso" },
  { q:"Comment reconnaître un site plus sécurisé ?", opts:["Il a de belles couleurs","Son adresse commence par https:// ✓","Il a des publicités","Il est rapide"], ans:1, emoji:"🌐", theme:"Navigation" },
  { q:"Mon mot de passe, je le partage avec...", opts:["Mes meilleurs amis","Tout le monde","Personne (sauf mes parents si nécessaire) ✓","Mon crush en ligne"], ans:2, emoji:"🤫", theme:"Mots de passe" },
  { q:"Si je vois du cyberharcèlement, je dois...", opts:["Liker les messages","Ne rien faire","Soutenir la victime et en parler à un adulte ✓","Rejoindre le groupe"], ans:2, emoji:"🦸", theme:"Cyberharcèlement" },
  { q:"Combien d'heures d'écran max par jour recommandé ?", opts:["30 minutes","1 heure","2 heures ✓","Autant qu'on veut"], ans:2, emoji:"⏰", theme:"Temps d'écran" },
  { q:"Pour télécharger un jeu, j'utilise...", opts:["N'importe quel site gratuit","Les boutiques officielles (App Store, Google Play) ✓","Un lien dans un email","La première pub"], ans:1, emoji:"📥", theme:"Navigation" },
];

const badges_level = [
  { min:0,  icon:"🌱", label:"Apprenti Cyber",    color:"#00BBF9" },
  { min:4,  icon:"⭐", label:"Cyber Explorateur",  color:"#9B5DE5" },
  { min:7,  icon:"🦸", label:"Cyber Héros",        color:"#FF4D8D" },
  { min:9,  icon:"🏆", label:"Cyber Champion !",   color:"#FFD60A" },
];

export default function QuizPage() {
  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState<number|null>(null);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [bestScore, setBestScore] = useState<number|null>(null);

  const { child, refresh } = useChild();
  useEffect(()=>{ if(child?.quiz_best_score) setBestScore(child.quiz_best_score); },[child]);

  const pick = (i:number) => {
    if (chosen!==null) return;
    setChosen(i);
    const correct = i===questions[idx].ans;
    if (correct) setScore(s=>s+1);
    setAnswers(prev=>[...prev, correct]);
  };

  const next = async () => {
    if (idx+1<questions.length) { setIdx(i=>i+1); setChosen(null); }
    else {
      const finalScore = score + (chosen===questions[idx].ans?1:0);
      const xpEarned = finalScore * 15;
      if (child) {
        await addQuizScore(child.id, finalScore, xpEarned);
        await refresh();
        setBestScore(prev => (!prev || finalScore > prev) ? finalScore : prev);
      }
      setDone(true);
    }
  };

  const restart = () => { setIdx(0); setScore(0); setChosen(null); setDone(false); setAnswers([]); setStarted(true); };

  const q = questions[idx];
  const badgeLevel = [...badges_level].reverse().find(b=>score>=b.min) || badges_level[0];

  if (!started) return (
    <div style={{ minHeight:"100vh", background:"#0D0A1A", paddingBottom:90 }}>
      <div className="orb" style={{ width:400, height:400, background:"rgba(255,214,10,0.1)", top:-80, left:-80 }} />
      <KidNav />
      <main style={{ padding:"20px 16px", maxWidth:560, margin:"0 auto", position:"relative", zIndex:1, display:"flex", alignItems:"center", justifyContent:"center", minHeight:"80vh" }}>
        <div className="kid-card fade-up" style={{ padding:40, textAlign:"center" }}>
          <div style={{ fontSize:72, marginBottom:16 }} className="bounce">⭐</div>
          <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:28, color:"white", marginBottom:8 }}>Quiz Star !</h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", marginBottom:24, lineHeight:1.7 }}>
            10 questions sur tout ce que tu as appris.<br/>Prouve que tu es un vrai cyber-héros !
          </p>
          {bestScore!==null && (
            <div style={{ background:"rgba(255,214,10,0.1)", border:"1px solid rgba(255,214,10,0.25)", borderRadius:14, padding:"12px 20px", marginBottom:20 }}>
              <p style={{ fontSize:13, fontWeight:800, color:"#FFD60A" }}>🏆 Ton meilleur score : {bestScore}/10</p>
            </div>
          )}
          <div style={{ display:"flex", gap:16, justifyContent:"center", marginBottom:28, flexWrap:"wrap" }}>
            {["📚 10 questions","⭐ 150 XP max","🏆 Badges à gagner"].map(t=>(
              <span key={t} style={{ fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.4)", background:"rgba(255,255,255,0.06)", padding:"4px 12px", borderRadius:20 }}>{t}</span>
            ))}
          </div>
          <button className="kid-btn" onClick={()=>setStarted(true)} style={{ background:"linear-gradient(135deg,#FFD60A,#FF6B35)", color:"white", padding:"16px 36px", fontSize:17, boxShadow:"0 8px 32px rgba(255,107,53,0.4)" }}>
            🚀 Commencer le quiz !
          </button>
        </div>
      </main>
    </div>
  );

  if (done) {
    const finalScore = answers.filter(Boolean).length;
    const bl = [...badges_level].reverse().find(b=>finalScore>=b.min) || badges_level[0];
    return (
      <div style={{ minHeight:"100vh", background:"#0D0A1A", paddingBottom:90 }}>
        <KidNav />
        <main style={{ padding:"20px 16px", maxWidth:560, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div className="kid-card pop" style={{ padding:40, textAlign:"center", border:"1px solid rgba(255,214,10,0.3)" }}>
            <div style={{ fontSize:80, marginBottom:12 }} className="bounce">{bl.icon}</div>
            <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:26, color:"white", marginBottom:4 }}>
              {finalScore>=9?"Incroyable !":finalScore>=7?"Super boulot !":finalScore>=5?"Bien joué !":"Continue d'apprendre !"}
            </h2>
            <p style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, color:bl.color, marginBottom:8 }}>{bl.label}</p>
            <p style={{ fontSize:15, color:"rgba(255,255,255,0.5)", marginBottom:24 }}>
              <strong style={{ color:"#FFD60A" }}>{finalScore}/10</strong> bonnes réponses · +{finalScore*15} XP gagnés !
            </p>
            <div style={{ display:"flex", gap:6, justifyContent:"center", marginBottom:28, flexWrap:"wrap" }}>
              {answers.map((a,i)=>(
                <div key={i} style={{ width:32, height:32, borderRadius:9, background:a?"rgba(0,245,212,0.2)":"rgba(255,77,141,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>
                  {a?"✅":"❌"}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <button className="kid-btn" onClick={restart} style={{ background:"rgba(255,255,255,0.08)", color:"white", padding:"12px 24px", fontSize:14, border:"1px solid rgba(255,255,255,0.15)" }}>🔁 Recommencer</button>
              <Link href="/kids" className="kid-btn" style={{ textDecoration:"none", background:"linear-gradient(135deg,#FFD60A,#FF6B35)", color:"white", padding:"12px 24px", fontSize:14 }}>🏠 Accueil</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:"#0D0A1A", paddingBottom:90 }}>
      <div className="orb" style={{ width:350, height:350, background:"rgba(255,214,10,0.08)", top:-60, right:-60 }} />
      <KidNav />
      <main style={{ padding:"20px 16px", maxWidth:560, margin:"0 auto", position:"relative", zIndex:1 }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:16, color:"white" }}>Question {idx+1}/10</span>
          <div style={{ background:"rgba(255,214,10,0.12)", border:"1px solid rgba(255,214,10,0.25)", borderRadius:12, padding:"6px 14px", display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:14 }}>⭐</span>
            <span style={{ fontSize:14, fontWeight:800, color:"#FFD60A" }}>{score}</span>
          </div>
        </div>
        {/* Progress */}
        <div style={{ display:"flex", gap:4, marginBottom:20 }}>
          {questions.map((_,i)=>(
            <div key={i} style={{ flex:1, height:7, borderRadius:4, background:i<idx?"#00F5D4":i===idx?"#FFD60A":"rgba(255,255,255,0.1)", transition:"all 0.3s" }} />
          ))}
        </div>
        {/* Question */}
        <div className="kid-card" style={{ padding:28, marginBottom:16 }}>
          <div style={{ fontSize:52, textAlign:"center", marginBottom:16 }}>{q.emoji}</div>
          <div style={{ background:`rgba(255,255,255,0.06)`, borderRadius:10, padding:"4px 12px", width:"fit-content", margin:"0 auto 16px", fontSize:11, fontWeight:800, color:"rgba(255,255,255,0.4)" }}>{q.theme}</div>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:18, color:"white", textAlign:"center", lineHeight:1.4 }}>{q.q}</h2>
        </div>
        {/* Options */}
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
          {q.opts.map((opt,i)=>{
            let bg="rgba(255,255,255,0.06)", border="1px solid rgba(255,255,255,0.12)", color="rgba(255,255,255,0.75)";
            if (chosen!==null) {
              if (i===q.ans) { bg="rgba(0,245,212,0.18)"; border="1px solid rgba(0,245,212,0.5)"; color="#00F5D4"; }
              else if (i===chosen) { bg="rgba(255,77,141,0.18)"; border="1px solid rgba(255,77,141,0.5)"; color="#FF4D8D"; }
            }
            return (
              <button key={i} onClick={()=>pick(i)} style={{ background:bg, border, borderRadius:14, padding:"13px 16px", textAlign:"left", cursor:chosen!==null?"default":"pointer", color, fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:700, transition:"all 0.2s", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:26, height:26, borderRadius:8, background:"rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:900, flexShrink:0 }}>
                  {["A","B","C","D"][i]}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
        {chosen!==null && (
          <button className="kid-btn" onClick={next} style={{ width:"100%", background:chosen===q.ans?"linear-gradient(135deg,#00F5D4,#00BBF9)":"linear-gradient(135deg,#FF6B35,#FF4D8D)", color:"white", padding:"14px", fontSize:15 }}>
            {chosen===q.ans?"✅ Bonne réponse ! Suivant →":"❌ Dommage... Suivant →"}
          </button>
        )}
      </main>
    </div>
  );
}
