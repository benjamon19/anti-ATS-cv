"""
Creador de CV — FastAPI backend
Receives CV data as JSON, converts it to RenderCV YAML, generates a PDF
(and optionally converts it to PNG), and streams the file back to the client.
"""

import io
import os
import re
import subprocess
import tempfile
from typing import Optional

import yaml
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, EmailStr, Field, field_validator

# Acepta números con dígitos, espacios y los separadores +, -, (, ) más comunes.
PHONE_REGEX = re.compile(r"^\+?[\d\s\-\(\)]{7,20}$")

# ────────────────────────────────────────────────────────────────────────────────
# Pydantic models — mirror the TypeScript CVData shape
# ────────────────────────────────────────────────────────────────────────────────

class PersonalData(BaseModel):
    name: str
    email: EmailStr
    phone: str
    location: str
    website: str = ""
    linkedin: str = ""
    github: str = ""

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not PHONE_REGEX.match(v.strip()):
            raise ValueError(
                "El teléfono debe contener solo dígitos y los separadores "
                "+, -, (, ) — ej: +54 9 11 1234-5678"
            )
        return v


class Experience(BaseModel):
    id: str
    company: str
    position: str
    startDate: str
    endDate: str
    current: bool = False
    location: str
    highlights: list[str] = Field(default_factory=list)


class Education(BaseModel):
    id: str
    institution: str
    degree: str
    area: str
    startDate: str
    endDate: str
    gpa: str = ""


class SkillGroup(BaseModel):
    label: str
    details: str


class TemplateSelection(BaseModel):
    theme: str = "classic"
    format: str = "pdf"


class CVRequest(BaseModel):
    personal: PersonalData
    summary: str
    experience: list[Experience]
    education: list[Education]
    skills: list[SkillGroup]
    template: TemplateSelection


# ────────────────────────────────────────────────────────────────────────────────
# App setup
# ────────────────────────────────────────────────────────────────────────────────

app = FastAPI(title="Creador de CV API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # Sin credenciales (cookies/auth): la API no las usa, y el spec de CORS no
    # permite combinar origin "*" con allow_credentials=True.
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ────────────────────────────────────────────────────────────────────────────────
# YAML builder
# ────────────────────────────────────────────────────────────────────────────────

def _strip_username(url: str, domain: str) -> str:
    """Extract username from a profile URL or return as-is if already a username."""
    if domain in url:
        return url.split(domain)[-1].strip("/").split("?")[0]
    return url.strip("/")


def build_rendercv_yaml(cv: CVRequest) -> dict:
    p = cv.personal

    cv_block: dict = {
        "name": p.name,
        "location": p.location,
        "email": p.email,
        "phone": p.phone,
    }

    if p.website:
        cv_block["website"] = p.website if p.website.startswith("http") else f"https://{p.website}"

    social = []
    if p.linkedin:
        social.append({"network": "LinkedIn", "username": _strip_username(p.linkedin, "linkedin.com/in/")})
    if p.github:
        social.append({"network": "GitHub", "username": _strip_username(p.github, "github.com/")})
    if social:
        cv_block["social_networks"] = social

    sections: dict = {}

    if cv.summary.strip():
        sections["summary"] = [cv.summary.strip()]

    if cv.experience:
        exp_list = []
        for e in cv.experience:
            entry = {
                "company": e.company,
                "position": e.position,
                "location": e.location,
                "start_date": e.startDate,
                "end_date": "present" if e.current else e.endDate,
                "highlights": [h for h in e.highlights if h.strip()],
            }
            exp_list.append(entry)
        sections["experience"] = exp_list

    if cv.education:
        edu_list = []
        for ed in cv.education:
            entry = {
                "institution": ed.institution,
                "area": ed.area,
                "degree": ed.degree,
                "start_date": ed.startDate,
                "end_date": ed.endDate,
            }
            if ed.gpa.strip():
                entry["highlights"] = [f"GPA: {ed.gpa.strip()}"]
            edu_list.append(entry)
        sections["education"] = edu_list

    if cv.skills:
        skill_list = [
            {"label": s.label, "details": s.details}
            for s in cv.skills
            if s.label.strip() and s.details.strip()
        ]
        if skill_list:
            sections["skills"] = skill_list

    cv_block["sections"] = sections

    return {
        "cv": cv_block,
        "design": {"theme": cv.template.theme},
    }


# ────────────────────────────────────────────────────────────────────────────────
# Endpoints
# ────────────────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/generate-cv")
async def generate_cv(cv: CVRequest):
    with tempfile.TemporaryDirectory() as tmpdir:
        # 1. Write YAML
        yaml_path = os.path.join(tmpdir, "cv.yaml")
        cv_data = build_rendercv_yaml(cv)

        with open(yaml_path, "w", encoding="utf-8") as f:
            yaml.dump(cv_data, f, allow_unicode=True, default_flow_style=False, sort_keys=False)

        # 2. Run RenderCV
        result = subprocess.run(
            ["rendercv", "render", yaml_path, "--output-folder", "output"],
            capture_output=True,
            text=True,
            cwd=tmpdir,
        )

        if result.returncode != 0:
            error_msg = result.stderr.strip() or result.stdout.strip() or "RenderCV failed with unknown error"
            raise HTTPException(status_code=500, detail=error_msg)

        # 3. Locate generated PDF
        output_dir = os.path.join(tmpdir, "output")
        if not os.path.isdir(output_dir):
            raise HTTPException(status_code=500, detail="RenderCV did not create an output folder")

        pdf_files = [f for f in os.listdir(output_dir) if f.endswith(".pdf")]
        if not pdf_files:
            raise HTTPException(status_code=500, detail="RenderCV did not produce a PDF file")

        pdf_path = os.path.join(output_dir, pdf_files[0])

        # 4a. PNG output — convert PDF → image
        if cv.template.format == "png":
            try:
                from pdf2image import convert_from_path  # type: ignore[import-untyped]
                from PIL import Image  # type: ignore[import-untyped]

                images = convert_from_path(pdf_path, dpi=200)

                img_buffer = io.BytesIO()
                if len(images) == 1:
                    images[0].save(img_buffer, format="PNG", optimize=True)
                else:
                    # Stitch multi-page PDF vertically into one image
                    total_height = sum(img.height for img in images)
                    max_width = max(img.width for img in images)
                    canvas = Image.new("RGB", (max_width, total_height), color="white")
                    y_offset = 0
                    for img in images:
                        canvas.paste(img, (0, y_offset))
                        y_offset += img.height
                    canvas.save(img_buffer, format="PNG", optimize=True)

                img_buffer.seek(0)
                return StreamingResponse(
                    img_buffer,
                    media_type="image/png",
                    headers={"Content-Disposition": 'attachment; filename="cv.png"'},
                )

            except ImportError:
                raise HTTPException(
                    status_code=500,
                    detail=(
                        "pdf2image is not installed. "
                        "Run: pip install pdf2image Pillow  "
                        "and make sure poppler is installed on your system."
                    ),
                )

        # 4b. PDF output — stream directly
        with open(pdf_path, "rb") as f:
            pdf_content = f.read()

        return StreamingResponse(
            io.BytesIO(pdf_content),
            media_type="application/pdf",
            headers={"Content-Disposition": 'attachment; filename="cv.pdf"'},
        )
