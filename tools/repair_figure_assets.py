#!/usr/bin/env python3
"""Restore damaged diagram/table assets from scanned official exam PDFs.

Default: replace only the 22 affected deployed figure images in-place, preserving
question IDs, answers, source links, and historical user progress.
The original Git-tracked images are untouched by this script in Git history;
the build step overwrites working-tree copies before rsync deployment.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError as exc:
    raise SystemExit("PyMuPDF is required: pip install 'pymupdf>=1.24,<2'") from exc

BASE = Path(__file__).resolve().parents[1]
MANIFEST = BASE / "tools" / "figure_repair_manifest.json"


def run(root: Path, output_root: Path | None = None) -> list[dict]:
    settings = json.loads((root / "tools" / "figure_repair_manifest.json").read_text("utf-8"))
    a1 = json.loads((root / "a1" / "data" / "a1_questions.json").read_text("utf-8"))
    am2 = json.loads((root / "am2" / "data" / "am2_questions.json").read_text("utf-8"))
    questions = {q["id"]: q for q in a1 + am2}
    entries = settings["figures"]
    if len(entries) != 22:
        raise ValueError(f"Expected exactly 22 figure repairs, found {len(entries)}")
    output_root = output_root or root
    report = []
    opened: dict[str, fitz.Document] = {}

    try:
        for ident, cfg in entries.items():
            q = questions.get(ident)
            if not q:
                raise ValueError(f"Missing question: {ident}")
            if not q.get("asset_path") or not q.get("source_page") or not q.get("source_file"):
                raise ValueError(f"Missing asset/source metadata: {ident}")
            if q.get("figure_repair_mode") != cfg["mode"]:
                raise ValueError(f"Manifest/data mode mismatch: {ident}")
            subdir = "a1" if q["section"] == "午前I" else "am2"
            source = root / "sources" / q["source_file"]
            if not source.is_file():
                raise FileNotFoundError(f"{ident}: {source}")
            if str(source) not in opened:
                opened[str(source)] = fitz.open(source)
            doc = opened[str(source)]
            page_num = q["source_page"] - 1
            if page_num < 0 or page_num >= len(doc):
                raise ValueError(f"{ident}: invalid source page {q['source_page']}")
            page = doc[page_num]
            rect = cfg.get("rect")
            if cfg["mode"] == "manual_crop":
                if not isinstance(rect, list) or len(rect) != 4:
                    raise ValueError(f"{ident}: invalid crop rectangle")
                x0, y0, x1, y1 = map(float, rect)
                if not (0 <= x0 < x1 <= 1 and 0 <= y0 < y1 <= 1):
                    raise ValueError(f"{ident}: crop extends beyond source page")
                clip = fitz.Rect(
                    page.rect.x0 + x0 * page.rect.width,
                    page.rect.y0 + y0 * page.rect.height,
                    page.rect.x0 + x1 * page.rect.width,
                    page.rect.y0 + y1 * page.rect.height,
                )
            elif cfg["mode"] == "full_page_fallback":
                if rect is not None:
                    raise ValueError(f"{ident}: fallback should not be cropped")
                clip = page.rect
            else:
                raise ValueError(f"{ident}: unsupported mode {cfg['mode']}")

            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2), clip=clip, alpha=False)
            if pix.width < 300 or pix.height < 100:
                raise ValueError(f"{ident}: suspiciously small resulting figure {pix.width}x{pix.height}")
            rel = Path(subdir) / q["asset_path"]
            target = output_root / rel
            if output_root == root and not target.is_file():
                raise ValueError(f"{ident}: refusing to create unexpected image at {target}")
            target.parent.mkdir(parents=True, exist_ok=True)
            temporary = target.with_name(target.name + ".tmp.png")
            pix.save(temporary)
            temporary.replace(target)
            if target.stat().st_size < 1024:
                raise ValueError(f"{ident}: generated image file is too small")
            report.append({
                "id": ident, "mode": cfg["mode"],
                "source": q["source_file"], "source_page": q["source_page"],
                "target": str(rel), "width": pix.width, "height": pix.height,
                "bytes": target.stat().st_size,
            })
    finally:
        for doc in opened.values():
            doc.close()
    return report


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=BASE)
    parser.add_argument("--output-root", type=Path, help="Write a preview tree rather than replacing tracked assets")
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    data = run(args.root.resolve(), args.output_root.resolve() if args.output_root else None)
    report = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(report, "utf-8")
    print(f"Rebuilt {len(data)} figures: {sum(d['mode']=='manual_crop' for d in data)} cropped, "
          f"{sum(d['mode']=='full_page_fallback' for d in data)} whole-page fallback")
    for record in data:
        print(f"  {record['id']} {record['mode']} {record['width']}x{record['height']} {record['bytes']} bytes")


if __name__ == "__main__":
    main()
