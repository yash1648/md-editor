/**
 * Markdown validation utilities for v3
 * Validates syntax, catches common issues, and provides helpful feedback
 */

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  type: "syntax" | "structure" | "encoding"
  message: string
  line?: number
  severity: "critical" | "high"
}

export interface ValidationWarning {
  type: "convention" | "performance" | "accessibility"
  message: string
  line?: number
  suggestion?: string
}

export function validateMarkdown(content: string): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  if (!content || content.trim().length === 0) {
    return { isValid: true, errors, warnings }
  }

  const lines = content.split("\n")

  // Check for unclosed code blocks
  const codeBlockMatches = content.match(/```/g) || []
  if (codeBlockMatches.length % 2 !== 0) {
    errors.push({
      type: "syntax",
      message: "Unclosed code block detected. Use ``` to close.",
      severity: "critical",
    })
  }

  // Check for unbalanced brackets
  const brackets = content.match(/[[\]{}()]/g) || []
  let openSquare = 0,
    openCurly = 0,
    openParen = 0
  for (const bracket of brackets) {
    if (bracket === "[") openSquare++
    else if (bracket === "]") openSquare--
    else if (bracket === "{") openCurly++
    else if (bracket === "}") openCurly--
    else if (bracket === "(") openParen++
    else if (bracket === ")") openParen--
  }

  if (openSquare !== 0 || openCurly !== 0 || openParen !== 0) {
    errors.push({
      type: "syntax",
      message: "Unbalanced brackets detected.",
      severity: "high",
    })
  }

  // Check for invalid heading hierarchy (jumping levels)
  let lastHeadingLevel = 0
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const match = line.match(/^#+/)
    if (match) {
      const level = match[0].length
      if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
        warnings.push({
          type: "convention",
          message: `Heading hierarchy skipped: jumped from H${lastHeadingLevel} to H${level}`,
          line: i + 1,
          suggestion: `Consider using H${lastHeadingLevel + 1} instead`,
        })
      }
      lastHeadingLevel = level
    }
  }

  // Check for very large content (>500KB can cause rendering issues)
  const sizeInKB = new Blob([content]).size / 1024
  if (sizeInKB > 500) {
    warnings.push({
      type: "performance",
      message: `Large file detected (${sizeInKB.toFixed(0)}KB). Preview may be slow.`,
    })
  }

  // Check for potential encoding issues
  const hasInvalidChars = /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g.test(content)
  if (hasInvalidChars) {
    errors.push({
      type: "encoding",
      message: "Invalid control characters detected.",
      severity: "high",
    })
  }

  // Check for accessibility issues (images without alt text)
  const imageMatches = content.match(/!\[.*?\]$$.*?$$/g) || []
  for (const img of imageMatches) {
    if (/!\[\s*\]\(/.test(img)) {
      warnings.push({
        type: "accessibility",
        message: "Image found without alt text",
        suggestion: "Add descriptive alt text: ![description](url)",
      })
    }
  }

  // Check for empty links
  const linkMatches = content.match(/\[.*?\]$$.*?$$/g) || []
  for (const link of linkMatches) {
    if (/\[\s*\]$$/.test(link) || /\]\(\s*$$/.test(link)) {
      warnings.push({
        type: "convention",
        message: "Empty link detected",
      })
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export function checkFileSize(content: string): { isValid: boolean; message?: string } {
  const sizeInMB = new Blob([content]).size / (1024 * 1024)
  if (sizeInMB > 10) {
    return {
      isValid: false,
      message: `File too large (${sizeInMB.toFixed(2)}MB). Maximum is 10MB.`,
    }
  }
  return { isValid: true }
}

export function canExport(content: string): { canExport: boolean; reason?: string } {
  if (!content || content.trim().length === 0) {
    return { canExport: false, reason: "Content is empty" }
  }

  const validation = validateMarkdown(content)
  if (!validation.isValid) {
    const errorMessages = validation.errors.map((e) => e.message).join(", ")
    return { canExport: false, reason: `Validation failed: ${errorMessages}` }
  }

  const sizeCheck = checkFileSize(content)
  if (!sizeCheck.isValid) {
    return { canExport: false, reason: sizeCheck.message }
  }

  return { canExport: true }
}
