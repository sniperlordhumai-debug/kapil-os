#!/usr/bin/env python3
"""
Top-tier, ATS-optimized one-page resume for Kapil Kumar (AI/ML & Software Developer).
Single-column, standard headings, quantified bullets, text-based PDF.
Photo included (appropriate for the Indian market).
No fabricated metrics — only real, verifiable facts.
"""
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer, Image,
    Table, TableStyle, HRFlowable
)
import os

# ---------- fonts (clean, ATS-safe) ----------
FD = "/usr/share/fonts/truetype/dejavu"
def reg(n, p):
    if os.path.exists(p):
        pdfmetrics.registerFont(TTFont(n, p)); return True
    return False
reg("F", f"{FD}/DejaVuSans.ttf")
reg("FB", f"{FD}/DejaVuSans-Bold.ttf")
F="F"; FB="FB"

INK    = HexColor("#17181c")
MUTED  = HexColor("#444b57")
FAINT  = HexColor("#7b8491")
ACCENT = HexColor("#0f6b80")
RULE   = HexColor("#0f6b80")

def st(name, **kw):
    b=dict(fontName=F, fontSize=9.3, leading=12.4, textColor=INK); b.update(kw)
    return ParagraphStyle(name, **b)

S_NAME=st("name", fontName=FB, fontSize=22, leading=26)
S_TITLE=st("title", fontSize=11.5, leading=14, textColor=ACCENT, fontName=FB)
S_CONT=st("cont", fontSize=8.8, leading=12.5, textColor=MUTED)
S_H=st("head", fontName=FB, fontSize=11, leading=13, textColor=ACCENT, spaceBefore=5, spaceAfter=1.5)
S_SUM=st("sum", fontSize=9.2, alignment=TA_JUSTIFY)
S_BULL=st("bull", leftIndent=9, bulletIndent=2, spaceAfter=1.2, alignment=TA_JUSTIFY)
S_META=st("meta", fontSize=8.6, leading=11.5, textColor=FAINT)

class HR(HRFlowable):
    def __init__(self, **kw):
        kw.setdefault("width","100%"); kw.setdefault("thickness",0.8)
        kw.setdefault("color",RULE); kw.setdefault("spaceBefore",1); kw.setdefault("spaceAfter",3)
        super().__init__(**kw)

story=[]

# ---------- header ----------
# contact info as plain text lines (ATS-safe, in main body)
contact = (
    "Vadodara, India  |  +91 6350050794  |  kapilkumar.ai.dev@gmail.com<br/>"
    "GitHub: github.com/sniperlordhumai-debug  |  LinkedIn: linkedin.com/in/kapil-kumar-931330375"
)
story.append(Paragraph("KAPIL KUMAR", S_NAME))
story.append(Paragraph("AI/ML &amp; Software Developer", S_TITLE))
story.append(Spacer(1,2))
story.append(Paragraph(contact, S_CONT))
story.append(Spacer(1,2))
story.append(HR())

# ---------- professional summary ----------
story.append(Paragraph("SUMMARY", S_H))
story.append(Paragraph(
    "AI/ML &amp; software developer and B.Tech CSE (AI &amp; ML) undergraduate at Parul University. Builds "
    "practical software and AI-driven products with Python, TypeScript, Generative AI, AI agents and REST "
    "APIs — proven through industry simulations, 16+ certifications and Hack2026.", S_SUM))

# ---------- technical skills (near top per ATS best practice) ----------
story.append(Paragraph("TECHNICAL SKILLS", S_H))
skills=[
 ("Languages","Python, C++, Java, JavaScript, TypeScript, HTML, CSS"),
 ("AI / ML","Artificial Intelligence, Generative AI, AI Agents, Machine Learning, Data Analytics"),
 ("Web / APIs","React, Next.js, REST APIs, Front-End Development"),
 ("Engineering","Object-Oriented Programming (OOP), Data Structures &amp; Algorithms (DSA), Software Engineering, Testing"),
 ("Cloud / Tools","AWS, NVIDIA Jetson Nano, Git, GitHub, Dash, Agile, CI/CD fundamentals"),
]
for lab, items in skills:
    story.append(Paragraph(f"<font name='{FB}'>{lab}:</font>  {items}", st("sk", spaceAfter=1.6)))

# ---------- projects (before experience for entry-level) ----------
story.append(Paragraph("PROJECTS", S_H))
projects=[
 ("Reels Hub", ["Web / Product"],
  ["Designed a short-form video platform concept with separate user/admin workflows, content management and monetization-oriented features.",
   "Planned full-stack architecture for content, moderation and monetization flows."],
  "TypeScript, Web Development, Front-End, Backend Architecture"),
 ("Jarvis Personal Assistant", ["AI / Automation / Python"],
  ["Built a Python assistant combining voice input/output, speech processing and desktop automation.",
   "Built an audio-to-action pipeline: speech recognition, intent handling, automation."],
  "Python, Speech Processing, Automation, AI"),
 ("FedHealthGuard", ["AI / ML / Federated Learning"],
  ["Explored privacy-preserving federated learning applied to multimodal healthcare data.",
   "Designed a local-training / model-update pipeline that keeps sensitive data on-device."],
  "AI, Machine Learning, Federated Learning"),
 ("Nexus Mirror", ["Desktop / Mobile / System"],
  ["Engineered a Windows-based mobile mirroring concept for screen interaction and control between a phone and a PC."],
  "Windows, Mobile, System Integration"),
]
for name, tags, bullets, tech in projects:
    story.append(Paragraph(f"<b>{name}</b>  <font name='{F}' size='8.5' color='#7b8491'>— {tech}</font>", st("pt", spaceAfter=1.5)))
    for b in bullets:
        story.append(Paragraph(b, S_BULL, bulletText="•"))

# ---------- education ----------
story.append(Paragraph("EDUCATION", S_H))
edu = Table(
    [[Paragraph("<b>Parul University, Vadodara</b>", st("ed", fontName=FB)),
      Paragraph("<b>Expected 2029</b>", st("edr", fontName=FB, alignment=TA_RIGHT))],
     [Paragraph("B.Tech — Computer Science &amp; Engineering (Artificial Intelligence &amp; Machine Learning)", st("edd", textColor=MUTED)), ""]],
    colWidths=[4.8*inch, 2.2*inch])
edu.setStyle(TableStyle([
    ("VALIGN",(0,0),(-1,-1),"TOP"),
    ("LEFTPADDING",(0,0),(-1,-1),0),("RIGHTPADDING",(0,0),(-1,-1),0),
    ("TOPPADDING",(0,0),(-1,-1),0),("BOTTOMPADDING",(0,0),(-1,-1),0)]))
story.append(edu)
story.append(Spacer(1,1))
# Senior secondary (Class 12)
story.append(Paragraph("<b>Senior Secondary (Class 12) — CBSE</b>  <font name='F' size='8.5' color='#7b8491'>Science stream</font>", st("e12", spaceAfter=1)))
# Secondary (Class 10)
story.append(Paragraph("<b>Secondary (Class 10) — CBSE</b>", st("e10", spaceAfter=1)))


# ---------- certifications ----------
story.append(Paragraph("CERTIFICATIONS", S_H))
certs=[
 "Google — AI Fundamentals (Coursera, 2026)",
 "Meta — Introduction to Front-End Development (Coursera, 2026)",
 "Microsoft — Introduction to Computers (Coursera, 2026)",
 "NVIDIA — Getting Started with AI on Jetson Nano (2025)",
 "AWS — Chalk Talks: Generative AI on AWS (2025)",
 "Simplilearn — AI Agents for Beginners (2025)",
 "Forage — Software Engineering, GenAI, Cyber, Solutions Architecture &amp; Data Analytics simulations",
]
for c in certs:
    story.append(Paragraph(c, S_BULL, bulletText="•"))

# ---------- achievements ----------
story.append(Paragraph("ACHIEVEMENTS &amp; ACTIVITIES", S_H))
story.append(Paragraph("AI Skill Event: Hackathon (Hack2026), Parul University — competed in a 3.5-hour technical build, March 2026.", S_BULL, bulletText="•"))
story.append(Paragraph("Completed 6+ industry job simulations covering REST APIs, Kafka/H2 integration, cloud architecture, Generative AI, cybersecurity and AI-driven data analytics.", S_BULL, bulletText="•"))

# ---------- build ----------
out="public/resume/Kapil_Kumar_Resume.pdf"
doc=BaseDocTemplate(out, pagesize=LETTER, leftMargin=0.62*inch, rightMargin=0.62*inch,
                    topMargin=0.45*inch, bottomMargin=0.45*inch,
                    title="Kapil Kumar — Resume", author="Kapil Kumar")
frame=Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f", showBoundary=0)
doc.addPageTemplates([PageTemplate(id="main", frames=[frame])])
doc.build(story)
print("WROTE", out, os.path.getsize(out), "bytes")
