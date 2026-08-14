#!/usr/bin/env python3
"""Generate Kapil Kumar's polished one-page resume PDF using reportlab."""
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, Frame, PageTemplate, Paragraph, Spacer,
    Table, TableStyle, Flowable, HRFlowable
)
import os

# ---------- register fonts ----------
FONT_DIR = "/usr/share/fonts/truetype"
def reg(name, path):
    if os.path.exists(path):
        pdfmetrics.registerFont(TTFont(name, path))
        return True
    return False

helv = reg("Helv", f"{FONT_DIR}/dejavu/DejaVuSans.ttf")
helv_b = reg("Helv-B", f"{FONT_DIR}/dejavu/DejaVuSans-Bold.ttf")
helv_o = reg("Helv-O", f"{FONT_DIR}/dejavu/DejaVuSans-Oblique.ttf")

F = "Helv" if helv else "Helvetica"
FB = "Helv-B" if helv_b else "Helvetica-Bold"
FO = "Helv-O" if helv_o else "Helvetica-Oblique"

# ---------- palette ----------
INK      = HexColor("#111318")
MUTED    = HexColor("#4b5563")
ACCENT   = HexColor("#0e7490")   # deep cyan/teal
ACCENT2  = HexColor("#155e75")
RULE     = HexColor("#0e7490")
BG_LIGHT = HexColor("#eef6f8")

# ---------- styles ----------
def st(name, **kw):
    base = dict(fontName=F, fontSize=10, leading=14, textColor=INK)
    base.update(kw)
    return ParagraphStyle(name, **base)

S_NAME   = st("name", fontName=FB, fontSize=26, leading=30, textColor=INK, alignment=TA_CENTER)
S_TITLE  = st("title", fontSize=12, leading=15, textColor=ACCENT2, alignment=TA_CENTER, spaceBefore=2)
S_CONTACT= st("contact", fontSize=9, leading=13, textColor=MUTED, alignment=TA_CENTER)
S_H      = st("head", fontName=FB, fontSize=11.5, leading=14, textColor=ACCENT2)
S_BODY   = st("body", fontSize=9.6, leading=13.5, textColor=INK, alignment=TA_JUSTIFY)
S_PROJ   = st("proj", fontSize=9.6, leading=13.5, textColor=INK, spaceAfter=3)
S_BULL   = st("bull", fontSize=9.4, leading=13, textColor=INK, leftIndent=10, bulletIndent=2)
S_META   = st("meta", fontSize=8.6, leading=12, textColor=MUTED)

class HR(HRFlowable):
    def __init__(self, **kw):
        kw.setdefault("width", "100%")
        kw.setdefault("thickness", 1)
        kw.setdefault("color", RULE)
        kw.setdefault("spaceBefore", 1)
        kw.setdefault("spaceAfter", 5)
        super().__init__(**kw)

def section(title, first=False):
    parts = []
    if not first:
        parts.append(Spacer(1, 7))
    parts.append(Paragraph(title.upper(), S_H))
    parts.append(HR())
    return parts

def contact_line(email, phone, github, linkedin):
    return (
        f"{phone}  |  {email}<br/>"
        f"GitHub: {github}  |  LinkedIn: {linkedin}"
    )

story = []

# ---------- header ----------
story.append(Paragraph("KAPIL KUMAR", S_NAME))
story.append(Paragraph("B.Tech CSE (AI &amp; ML) &nbsp;•&nbsp; AI/ML &amp; Software Developer", S_TITLE))
story.append(Paragraph(contact_line(
    "kapilkumar.ai.dev@gmail.com", "+91 6350050794",
    "github.com/sniperlordhumai-debug", "linkedin.com/in/kapil-kumar-931330375"
), S_CONTACT))
story.append(Spacer(1, 3))
story.append(HR())

# ---------- profile ----------
story += section("Profile", first=True)
story.append(Paragraph(
    "AI &amp; ML undergraduate focused on building practical software and AI-driven products. Hands-on "
    "exposure to Python, C++, Java, web development, REST APIs, Generative AI, AI agents, data analytics "
    "and cloud fundamentals. Demonstrated initiative through industry job simulations, technical projects "
    "and Hack2026 participation.", S_BODY))

# ---------- education ----------
story += section("Education")
edu = Table(
    [[Paragraph("<b>Parul University, Vadodara</b>", S_PROJ),
      Paragraph("<b>B.Tech CSE (AI &amp; ML)</b>", ParagraphStyle("r", parent=S_PROJ, alignment=2))],
     [Paragraph("B.Tech — Computer Science &amp; Engineering (Artificial Intelligence &amp; Machine Learning)",
                ParagraphStyle("d", parent=S_PROJ, textColor=MUTED)), ""]],
    colWidths=[5.1*inch, 2.0*inch])
edu.setStyle(TableStyle([
    ("VALIGN", (0,0), (-1,-1), "TOP"),
    ("LEFTPADDING", (0,0), (-1,-1), 0),
    ("RIGHTPADDING", (0,0), (-1,-1), 0),
    ("TOPPADDING", (0,0), (-1,-1), 0),
    ("BOTTOMPADDING", (0,0), (-1,-1), 0),
]))
story.append(edu)

# ---------- technical skills ----------
story += section("Technical Skills")
skills = [
    ("Programming", "Python, C++, Java, JavaScript / TypeScript"),
    ("Web", "HTML, CSS, Front-End Development, REST APIs"),
    ("AI / Data", "Artificial Intelligence, Generative AI, AI Agents, Data Analytics"),
    ("Engineering", "OOP, DSA, Software Engineering, Git / GitHub, Testing"),
    ("Cloud / Platforms", "AWS, NVIDIA Jetson Nano, Dash"),
]
for label, items in skills:
    story.append(Paragraph(
        f"<font name='{FB}'>{label}:</font>  {items}",
        ParagraphStyle("sk", parent=S_BODY, spaceAfter=2.5)))

# ---------- projects ----------
story += section("Selected Projects")
projects = [
    ("Reels Hub", "Short-form video platform concept with separate user/admin workflows, content management and monetization-oriented features."),
    ("Nexus Mirror", "Windows-based mobile mirroring project focused on connecting a phone to a PC for screen interaction and control."),
    ("Jarvis Personal Assistant", "Python assistant concept combining voice input/output with desktop automation and computer interaction."),
    ("FedHealthGuard", "Federated-learning AI/ML concept for privacy-preserving healthcare-oriented multimodal data processing."),
]
for name, desc in projects:
    story.append(Paragraph(f"<b>{name}</b> — {desc}", S_PROJ))

# ---------- certifications ----------
story += section("Selected Certifications")
certs = [
    "Google: AI Fundamentals — Coursera (Apr 2026)",
    "Meta: Introduction to Front-End Development — Coursera (Apr 2026)",
    "NVIDIA: Getting Started with AI on Jetson Nano (Aug 2025)",
    "AWS: Chalk Talks — Generative AI on AWS (Aug 2025)",
    "Simplilearn: AI Agents for Beginners (Aug 2025)",
    "Forage: Software Engineering, GenAI, Cyber, Solutions Architecture &amp; Data Analytics simulations (2025–26)",
]
for c in certs:
    story.append(Paragraph(c, ParagraphStyle("cert", parent=S_BODY, spaceAfter=1.5)))

# ---------- achievements ----------
story += section("Achievements &amp; Activities")
story.append(Paragraph("AI Skill Event: Hackathon (Hack2026), Parul University — participated March 2026.", S_BULL, bulletText="•"))
story.append(Paragraph(
    "Completed practical industry simulations covering REST APIs, Kafka/H2 integration, cloud architecture, "
    "GenAI, cybersecurity and AI-driven data analytics.", S_BULL, bulletText="•"))

# ---------- build ----------
out = "public/resume/Kapil_Kumar_Resume.pdf"
doc = BaseDocTemplate(
    out, pagesize=LETTER,
    leftMargin=0.65*inch, rightMargin=0.65*inch,
    topMargin=0.5*inch, bottomMargin=0.5*inch,
    title="Kapil Kumar — Resume",
    author="Kapil Kumar",
)
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="f", showBoundary=0)
doc.addPageTemplates([PageTemplate(id="main", frames=[frame])])
doc.build(story)
print("WROTE", out, os.path.getsize(out), "bytes")
