import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "./Poi.module.css";

export default function Poi() {
  const markdownContent = `
# Cài tuỳ chỉnh của Hoan cho ZBrush

---
## 🎨 Giới thiệu 4 palette (A, B, C, D)
abc  
abc  
abc  
abc  
abc  
abc  

## ⌨️ Phím tắt
def  
def  
def  
def  
def  
def  
def  

## 🙀 Cách cài vào máy (thủ công)
ghi  
ghi  
ghi  
ghi  
ghi  
ghi  
ghi  

## 🤖 Cách cài vào máy (nhanh)
jkl  
jkl  
jkl  
jkl  
jkl  
jkl  
jkl  
jkl  
  `;

  return (
    <div className={styles.poi}>
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
    </div>
  );
}
