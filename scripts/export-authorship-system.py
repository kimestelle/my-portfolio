#!/usr/bin/env python3
"""Export the evidence-backed authorship manual from DOCX to interactive Markdown."""

from __future__ import annotations

import html
import re
import sys
from pathlib import Path

from docx import Document
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph


CALLOUTS = (
    "WORKING THESIS",
    "IMPORTANT LIMIT",
    "AUTHORSHIP TEST",
    "COLLABORATION INVARIANT",
    "INTERPRETATION",
    "OPERATING SENTENCE",
)


def iter_blocks(document: Document):
    for child in document.element.body.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, document)
        elif isinstance(child, CT_Tbl):
            yield Table(child, document)


def paragraph_numbering(paragraph: Paragraph) -> str | None:
    props = paragraph._p.pPr
    if props is None or props.numPr is None or props.numPr.numId is None:
        return None
    num_id = int(props.numPr.numId.val)
    if num_id == 31:
        return "-"
    if num_id == 32:
        return "1."
    return "-"


def clean(text: str) -> str:
    normalized = re.sub(r"\s+", " ", text).strip()
    return normalized.replace(
        "/Users/estellekim/projects",
        "the portfolio workspace",
    )


def escape_cell(text: str) -> str:
    return clean(text).replace("|", "\\|")


def table_markdown(table: Table) -> list[str]:
    rows = [[escape_cell(cell.text) for cell in row.cells] for row in table.rows]
    if not rows:
        return []
    width = max(len(row) for row in rows)
    rows = [row + [""] * (width - len(row)) for row in rows]
    lines = [
        "| " + " | ".join(rows[0]) + " |",
        "| " + " | ".join("---" for _ in range(width)) + " |",
    ]
    lines.extend("| " + " | ".join(row) + " |" for row in rows[1:])
    return lines


def callout_markdown(text: str) -> str | None:
    for label in CALLOUTS:
        if text.startswith(label):
            body = text[len(label) :].strip(" .")
            return f"> **{label.lower()}.** {body}"
    return None


def export(source: Path, destination: Path) -> None:
    document = Document(source)
    lines: list[str] = []
    details_open = False
    first_details = True
    pending_kicker: str | None = None

    for block in iter_blocks(document):
        if isinstance(block, Table):
            lines.extend(["", *table_markdown(block), ""])
            continue

        raw = block.text.strip()
        if not raw:
            continue
        text = clean(raw)
        style = block.style.name

        if style == "Title":
            lines.extend(["# how I build 0 → 1", ""])
            continue
        if style == "Subtitle":
            lines.extend(
                [
        "*How I turn an idea into working software, from the first question to the final checks.*",
                    "",
                ]
            )
            continue
        if text == "EVIDENCE-BACKED OPERATING MANUAL":
            continue
            continue
        if text.startswith("Prepared from accessible"):
            lines.extend([f"_{text}_", ""])
            continue
        if text.startswith("PART ") or text == "HOW TO USE THIS":
            pending_kicker = text
            continue

        if style == "Heading 1":
            if details_open:
                lines.extend(["", "</details>", ""])
            open_attr = " open" if first_details else ""
            lines.extend(
                [
                    f'<details class="process-section"{open_attr}>',
                    f"<summary>{html.escape(text)}</summary>",
                    "",
                ]
            )
            if pending_kicker:
                lines.extend(
                    [
                        f'<p class="process-kicker">{html.escape(pending_kicker)}</p>',
                        "",
                    ]
                )
            pending_kicker = None
            details_open = True
            first_details = False
            continue

        if style == "Heading 2":
            lines.extend([f"### {text}", ""])
            continue

        numbered_step = re.match(r"^(\d{2})\s+(.+)$", text)
        if numbered_step:
            lines.extend(
                [f"#### {numbered_step.group(1)} / {numbered_step.group(2)}", ""]
            )
            continue

        callout = callout_markdown(text)
        if callout:
            lines.extend([callout, ""])
            continue

        marker = paragraph_numbering(block)
        if marker:
            lines.extend([f"{marker} {text}", ""])
        else:
            lines.extend([text, ""])

    if details_open:
        lines.extend(["</details>", ""])

    header = [
        "<!-- Generated from Estelle_Kim_Authorship_System.docx. -->",
        "<!-- Edit the source document or this Markdown intentionally; do not silently normalize the language. -->",
        "",
    ]
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text("\n".join(header + lines), encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit("usage: export-authorship-system.py SOURCE.docx DESTINATION.md")
    export(Path(sys.argv[1]), Path(sys.argv[2]))
