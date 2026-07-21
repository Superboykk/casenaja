# 📁 CASE ARCHIVE SYSTEM (v4.09)
### National Paranormal & Pathological Incident Database // Restricted Access

![Clearance Level](https://img.shields.io/badge/CLEARANCE-LEVEL_4_RESTRICTED-red?style=for-the-badge&logo=shield)
![Status](https://img.shields.io/badge/STATUS-OPEN_INVESTIGATION-amber?style=for-the-badge)
![Deployment](https://img.shields.io/badge/GITHUB_PAGES-LIVE-brightgreen?style=for-the-badge&logo=github)

เว็บแอปพลิเคชันคลังแฟ้มเอกสารสืบสวนคดีลับสไตล์ **Mockumentary / Found Footage** ออกแบบมาสำหรับนำเสนอนิยายการสืบสวนเชิงนิติวิทยาศาสตร์ปะทะความเชื่อ ผ่านเอกสารจำลองสมจริง (รายงานทางการแพทย์, รายงานตำรวจ, บันทึกแชท LINE, โพสต์เฟซบุ๊ก, ใบเสร็จรับเงิน, ภาพวาดแนบหลักฐาน และไฟล์ถอดเสียง)

🌐 **เข้าชมเว็บไซต์ออนไลน์ (Live Demo):**  
[https://superboykk.github.io/casenaja/](https://superboykk.github.io/casenaja/)

---

## 🌟 คุณสมบัติเด่น (Key Features)

- 🏠 **Home Vault Landing Page:** หน้าแรกเลือกแฟ้มคดีแยกตามหมวดหมู่ พร้อมข้อมูลย่อ ระดับชั้นความลับ และจำนวนเอกสาร
- 📜 **Realistic Paper & Classified UI:**
  - ตราปั๊มยางสีแดง `TOP SECRET` / `RESTRICTED` / `CONFIDENTIAL` ปั๊มบนกระดาษปาปิรุสเก่า
  - แถบเซ็นเซอร์ความลับ `[REDACTED]` สามารถกดแตะคลิกเปิด/ปิดซ่อนข้อความลับได้
  - ปุ่มสลับโหมดระหว่าง **"Paper Mode (กระดาษสมจริง)"** และ **"Clean Mode (อ่านสบายตา)"**
- 💬 **Social & Messaging Elements:**
  - **LINE Chat UI:** แสดงผลแชทฝั่งซ้าย-ขวา พร้อมสติ๊กเกอร์ รูปแนบ การ์ดบันทึกเสียงฉุกเฉิน
  - **Facebook Post UI:** โพสต์เพซบุ๊กสตรีมสดล่าผี พร้อมปุ่ม Reaction, ยอดแชร์ และคอมเมนต์ชาวบ้าน
- 🧾 **Thermal Store Receipt UI:** สลิปใบเสร็จรับเงินเครื่องพิมพ์ความร้อน มีรอยหยักฟันปลา บาร์โค้ด และตารางสินค้า
- 🖼️ **Evidence Attachment Frame:** กรอบรูปแนบหลักฐานนิติวิทยาศาสตร์ (เช่น ภาพวาดสีเทียนของเด็กประถม)
- 🎵 **Audio Cassette Player:** เครื่องเล่นเทปคาสเซ็ทจำลองฟังบันทึกเสียงหลักฐานในคดี
- 📱 **Mobile Responsive:** รองรับการใช้งานผ่านมือถือ สมาร์ตโฟน และแท็บเล็ตเต็มรูปแบบ (มีระบบ Sidebar Drawer)

---

## 📂 โครงสร้างแฟ้มคดีในระบบ (Current Case Files)

| Case ID | ชื่อแฟ้มคดี | ช่วงเวลา | ระดับความลับ | จำนวนเอกสาร |
| :---: | :--- | :---: | :---: | :---: |
| **CASE-001** | ถอดรหัสปรากฏการณ์พยาธิวิทยากับความเชื่อ (คดีกระสือ) | 1978 - 2025 | `CONFIDENTIAL` | 12 เอกสาร |
| **CASE-002** | การอากาศยานและวัตถุบินไร้ที่มา (คดีกระหัง) | 1988 - 2021 | `RESTRICTED` | อยู่ระหว่างเตรียมแฟ้ม |
| **CASE-003** | ภาวะอุปาทานหมู่และการติดเชื้อทางประสาท (คดีปอบ) | 1995 - 2024 | `RESTRICTED` | อยู่ระหว่างเตรียมแฟ้ม |

---

## 🏗️ โครงสร้างไฟล์ (Project Directory)

```text
casenaja/
├── index.html                  # หน้าหลักอินเทอร์เฟซ Single Page Application
├── style.css                   # สไตล์ Dark Mode, กระดาษเก่า, ตราปั๊ม, แชท LINE, โพสต์ FB, ใบเสร็จ
├── app.js                      # ระบบ Markdown Parser, ค้นหา, กรอง และสลับโหมด
├── start_web.bat               # สคริปต์ดับเบิลคลิกรัน Local Web Server บน Windows
├── cases/
│   ├── cases_index.json        # ดรรชนีรวมแฟ้มคดีทั้งหมดในระบบ
│   └── krasue_case/            # แฟ้มคดีที่ 001 (กระสือ)
│       ├── manifest.json       # ดรรชนีเอกสาร 12 ฉบับ
│       ├── DOC-001.md ถึง DOC-012.md
│       └── assets/             # รูปภาพและไฟล์เสียงแนบหลักฐาน
└── documents/                  # โฟลเดอร์สำรองข้อมูลดรรชนี
```

---

## 📝 วิธีการเพิ่มเอกสารใหม่ในแฟ้มคดี

1. สร้างไฟล์ Markdown ใหม่ (เช่น `DOC-013.md`) ไว้ในโฟลเดอร์ `/cases/krasue_case/`
2. ใส่ **YAML Frontmatter** ด้านบนสุดของไฟล์:

```markdown
---
id: DOC-013
title: ชื่อเอกสารภาษาไทย / English Title
type: Medical Record / Police Log / Chat Log / Store Receipt
author: ชื่อผู้แต่ง/หน่วยงานผู้สร้างเอกสาร
date: YYYY-MM-DD
location: สถานที่เกิดเหตุ
clearance: CONFIDENTIAL / RESTRICTED / UNCLASSIFIED
reliability: 5
tags: ["Tag1", "Tag2"]
---

เนื้อหาเอกสารตามปกติ สามารถใส่ข้อความเซ็นเซอร์ [REDACTED ข้อความลับ] ได้
```

3. อัปเดตข้อมูลไฟล์ใหม่เพิ่มเข้าไปใน `/cases/krasue_case/manifest.json`

---

## 💻 วิธีเปิดรันบนเครื่องคอมพิวเตอร์ (Local Setup)

1. ดับเบิลคลิกเปิดไฟล์ **`start_web.bat`** (ระบบจะรัน Local Web Server และเปิดเบราว์เซอร์ที่ `http://localhost:8080` ให้อัตโนมัติ)
2. หรือใช้ Python คำสั่ง:
   ```bash
   python -m http.server 8080
   ```

---

*Property of Department of Special Investigation // Confidential Archive File*
